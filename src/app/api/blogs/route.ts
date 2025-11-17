import admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Public endpoint for logged-in users to submit a blog post. Defaults to PENDING status.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Giriş yapmalısınız.' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, imageUrl, slug } = body
    if (!title || !content || !slug) {
      return NextResponse.json({ success: false, error: 'Başlık, içerik ve slug zorunludur.' }, { status: 400 })
    }

    // Resolve stable authorId
    let authorId = session?.user?.id ?? null
    try {
      if (!authorId) {
        const username = session.user.username
        let q = await firestoreAdmin.collection('users').where('username', '==', username).limit(1).get()
        if (!q.empty) authorId = q.docs[0].id
        else if (session.user.email) {
          q = await firestoreAdmin.collection('users').where('email', '==', session.user.email).limit(1).get()
          if (!q.empty) authorId = q.docs[0].id
        }
      }
    } catch (e) {
      console.warn('Could not resolve authorId for blog submit:', e)
    }

    const newPost = await firestoreAdmin.collection('blogs').add({
      title,
      slug,
      content,
      imageUrl: imageUrl || null,
      author: session.user.name || session.user.email || null,
      authorUsername: session.user.username || session.user.email || null,
      authorImage: session.user.image || null,
      authorId: authorId || null,
      status: 'PENDING',
      isPublished: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, id: newPost.id })
  } catch (error) {
    console.error('Public blog submit error', error)
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
