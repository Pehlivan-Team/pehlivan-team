import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

export async function GET(
  _req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ liked: false }, { status: 200 })
    }
    const userId = session.user.email
    const postRef = firestoreAdmin.collection('posts').doc(resolvedParams.postId)
    const likeRef = postRef.collection('likes').doc(userId)

    const [postSnap, likeSnap] = await Promise.all([
      postRef.get(),
      likeRef.get()
    ])

    if (!postSnap.exists) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    const data = postSnap.data() as any
    return NextResponse.json({ 
      liked: likeSnap.exists,
      likeCount: data.likeCount || 0 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get like status error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  _req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.email
    const postRef = firestoreAdmin.collection('posts').doc(resolvedParams.postId)
    const likeRef = postRef.collection('likes').doc(userId)

    const result = await firestoreAdmin.runTransaction(async (tx) => {
      const postSnap = await tx.get(postRef)
      if (!postSnap.exists) {
        throw new Error('not_found')
      }
      const likeSnap = await tx.get(likeRef)
      const data = postSnap.data() as any
      let likeCount = data.likeCount || 0
      let liked: boolean

      if (likeSnap.exists) {
        tx.delete(likeRef)
        likeCount = Math.max(0, likeCount - 1)
        liked = false
      } else {
        tx.set(likeRef, { userId, createdAt: new Date() })
        likeCount = likeCount + 1
        liked = true
      }
      tx.update(postRef, { likeCount })
      return { liked, likeCount }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    if (error?.message === 'not_found') {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    console.error('Toggle like error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
