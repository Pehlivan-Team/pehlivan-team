import admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { createPostSchema, listPostsSchema } from '@/lib/validation/posts'
import { CreatePostRequest, CreatePostResponse, ListPostsResponse } from '@/types/posts'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session: any = await getServerSession(authOptions as any)
    if (!session || !session.user || !session.user.email || !session.user.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = (await req.json()) as CreatePostRequest
    const parsed = createPostSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }
  const { content = '', imageUrl, type, linkUrl } = parsed.data

    // Enforce admin-only for sponsored posts
    if (type === 'sponsored' && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can create sponsored content.' },
        { status: 403 }
      )
    }

    const now = admin.firestore.FieldValue.serverTimestamp()

    const docRef = await firestoreAdmin.collection('posts').add({
      authorUsername: session.user.username,
      authorId: session.user.email,
      content,
      imageUrl: imageUrl || null,
      type: type || 'social',
      linkUrl: linkUrl || null,
      likeCount: 0,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
    })

    const res: CreatePostResponse = { id: docRef.id }
    return NextResponse.json(res, { status: 201 })
  } catch (error) {
    console.error('Create post error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const parsed = listPostsSchema.safeParse({
      username: searchParams.get('username'),
      limit: searchParams.get('limit'),
      cursor: searchParams.get('cursor'),
    })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }
    const { username, limit = 10, cursor } = parsed.data

    let query = firestoreAdmin
      .collection('posts')
      .where('authorUsername', '==', username)
      .orderBy('createdAt', 'desc')
      .limit(limit + 1)

    if (cursor) {
      const cursorTs = admin.firestore.Timestamp.fromDate(new Date(cursor))
      query = query.startAfter(cursorTs)
    }

    const snapshot = await query.get()
    const docs = snapshot.docs
    const hasNext = docs.length > limit
    const pageDocs = hasNext ? docs.slice(0, limit) : docs

    const posts = pageDocs.map((d) => ({ id: d.id, ...d.data() }))
    const nextCursor = hasNext
      ? (pageDocs[pageDocs.length - 1].get('createdAt')?.toDate()?.toISOString() as
          | string
          | undefined)
      : undefined

  const res: ListPostsResponse = { posts: posts as any, nextCursor }
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.error('List posts error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
