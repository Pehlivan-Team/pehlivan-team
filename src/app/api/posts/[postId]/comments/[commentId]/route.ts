import admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

export async function DELETE(
  _req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    console.debug('[comment DELETE] params:', resolvedParams)
    
    const session: any = await getServerSession(authOptions as any)
    const userId = session?.user?.id || session?.user?.email
    const username = session?.user?.username || session?.user?.name || null
    
    if (!session || !session.user || !userId) {
      console.warn('[comment DELETE] unauthorized - session missing or incomplete', { session })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postId = resolvedParams?.postId
    const commentId = resolvedParams?.commentId
    
    if (!postId || !commentId) {
      console.error('[comment DELETE] missing postId or commentId in params', { resolvedParams })
      return NextResponse.json({ error: 'Missing postId or commentId' }, { status: 400 })
    }

    const postRef = firestoreAdmin.collection('posts').doc(postId)
    const commentRef = postRef.collection('comments').doc(commentId)

    const result = await firestoreAdmin.runTransaction(async (tx) => {
      const [postSnap, commentSnap] = await Promise.all([
        tx.get(postRef),
        tx.get(commentRef)
      ])
      
      if (!postSnap.exists) {
        throw new Error('post_not_found')
      }
      
      if (!commentSnap.exists) {
        throw new Error('comment_not_found')
      }

      const commentData = commentSnap.data()
      
      // Check if user is the author of the comment or an admin
      const isCommentAuthor = commentData?.userId === userId || commentData?.username === username
      const isAdmin = session?.user?.isAdmin === true
      
      if (!isCommentAuthor && !isAdmin) {
        throw new Error('forbidden')
      }

      // Delete the comment
      tx.delete(commentRef)
      
      // Decrease comment count
      const postData = postSnap.data() as any
      const nextCount = Math.max(0, (postData.commentCount || 1) - 1)
      tx.update(postRef, { commentCount: nextCount })
      
      return { commentCount: nextCount }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    if (error?.message === 'post_not_found') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    if (error?.message === 'comment_not_found') {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }
    if (error?.message === 'forbidden') {
      return NextResponse.json({ error: 'Forbidden - You can only delete your own comments' }, { status: 403 })
    }
    console.error('Delete comment error', error)
    const message = error?.message || 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}