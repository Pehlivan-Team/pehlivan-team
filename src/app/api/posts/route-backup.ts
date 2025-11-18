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
  const { content = '', imageUrl, imageUrls, type, linkUrl, mentions, hashtags } = parsed.data

    // Enforce admin-only for sponsored posts
    if (type === 'sponsored' && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can create sponsored content.' },
        { status: 403 }
      )
    }

    // Resolve a stable authorId (prefer session.user.id if present)
    let authorId: string | null = session?.user?.id ?? null
    if (!authorId) {
      try {
        // Try to resolve by username first, then email
        const username = session.user.username
        let q = await firestoreAdmin.collection('users').where('username', '==', username).limit(1).get()
        if (!q.empty) {
          authorId = q.docs[0].id
        } else if (session.user.email) {
          q = await firestoreAdmin.collection('users').where('email', '==', session.user.email).limit(1).get()
          if (!q.empty) authorId = q.docs[0].id
        }
      } catch (e) {
        console.warn('Could not resolve authorId for session user:', e)
      }
    }

    const now = admin.firestore.FieldValue.serverTimestamp()

    const docData: any = {
      authorUsername: session.user.username,
      authorId: authorId || null,
      content,
      imageUrl: imageUrl || (Array.isArray(imageUrls) && imageUrls.length ? imageUrls[0] : null),
      imageUrls: Array.isArray(imageUrls) && imageUrls.length ? imageUrls : (imageUrl ? [imageUrl] : null),
      type: type || 'social',
      linkUrl: linkUrl || null,
      likeCount: 0,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    if (mentions && mentions.length) docData.mentions = mentions
    if (hashtags && hashtags.length) docData.hashtags = hashtags

    const docRef = await firestoreAdmin.collection('posts').add(docData)

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
      // Batch-fetch public profiles for the authors to avoid client-side per-post requests
      try {
        const usernames = Array.from(new Set(posts.map((p: any) => p.authorUsername).filter(Boolean)))
        const authorProfiles: Record<string, any> = {}

        // Firestore 'in' queries are limited to 10 values, so chunk if necessary
        const chunk = (arr: string[], size = 10) => {
          const res: string[][] = []
          for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
          return res
        }

        const chunks = chunk(usernames, 10)
        for (const c of chunks) {
          const usersQ = await firestoreAdmin
            .collection('users')
            .where('username', 'in', c)
            .get()
          usersQ.docs.forEach((ud) => {
            const data = ud.data()
            authorProfiles[data.username] = {
              username: data.username,
              name: data.name,
              profilePictureUrl: data.profilePictureUrl || null,
              bio: data.bio,
              socialLinks: data.socialLinks || null,
            }
          })
        }

        // attach authorProfile to each post if available
        posts.forEach((p: any) => {
          p.authorProfile = authorProfiles[p.authorUsername] || null
        })
      } catch (err) {
        console.warn('Could not batch author profiles', err)
      }
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
