import admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { createCommentSchema } from '@/lib/validation/posts'
import { CreateCommentRequest, ListCommentsResponse } from '@/types/posts'

export async function GET(
  req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    console.debug('[comments GET] params:', resolvedParams)
    const { searchParams } = new URL(req.url)
    const limitParam = parseInt(searchParams.get('limit') || '10', 10)
    const limit = Math.max(1, Math.min(50, isNaN(limitParam) ? 10 : limitParam))
    const cursor = searchParams.get('cursor') || undefined

    const postId = resolvedParams?.postId
    if (!postId) {
      console.error('[comments GET] missing postId in params', { resolvedParams })
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    let query = firestoreAdmin
      .collection('posts')
      .doc(postId)
      .collection('comments')
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

    const comments = pageDocs.map((d) => ({ id: d.id, ...d.data() }))
    const nextCursor = hasNext
      ? (pageDocs[pageDocs.length - 1].get('createdAt')?.toDate()?.toISOString() as
          | string
          | undefined)
      : undefined

    const res: ListCommentsResponse = { comments: comments as any, nextCursor }
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.error('List comments error', error)
    // Surface the error message when available to make debugging easier in dev
    const message = (error as any)?.message || 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    console.debug('[comments POST] params:', resolvedParams)
    const session: any = await getServerSession(authOptions as any)
    console.debug('[comments POST] session:', session)
    // Accept either the stable `session.user.id` (preferred) or the legacy email.
    const userId = session?.user?.id || session?.user?.email
    const username = session?.user?.username || session?.user?.name || null
    if (!session || !session.user || !userId) {
      console.warn('[comments POST] unauthorized - session missing or incomplete', { session })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as CreateCommentRequest
    const parsed = createCommentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }
    const { content } = parsed.data

    const postId = resolvedParams?.postId
    if (!postId) {
      console.error('[comments POST] missing postId in params', { resolvedParams })
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    const postRef = firestoreAdmin.collection('posts').doc(postId)
    const commentsRef = postRef.collection('comments')

    const result = await firestoreAdmin.runTransaction(async (tx) => {
      const postSnap = await tx.get(postRef)
      if (!postSnap.exists) throw new Error('not_found')

      const newRef = commentsRef.doc()
      tx.set(newRef, {
        userId,
        username,
        content,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      const data = postSnap.data() as any
      const nextCount = (data.commentCount || 0) + 1
      tx.update(postRef, { commentCount: nextCount })
      return { id: newRef.id, commentCount: nextCount }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    if (error?.message === 'not_found') {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    console.error('Create comment error', error)
    const message = error?.message || 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
