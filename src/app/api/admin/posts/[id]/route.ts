import admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// YAZI GÜNCELLEME (PUT)
export async function PUT(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }
    const docId = resolvedParams?.id
    const body = await request.json()
    /*
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      kısmı önemli.
      Bu, Firestore'da olayın oluşturulma zamanını doğru bir şekilde kaydetmek için kullanılır.
      Klasik JS Date objesi ile de timestamp oluşturulabilir ancak bu durumda istemci ve sunucu saat dilimi farklılıkları
      nedeniyle tutarsızlıklar yaşanabilir. Bu yüzden Firestore'un kendi timestamp'ini kullanmak en iyisidir.
      Peki zaten firestore'da createdAt alanı var, neden bir de biz ekliyoruz?
      Çünkü firestore'un kendi timestamp'i, veritabanına veri eklenirken otomatik olarak oluşturulur.
      Ancak biz API üzerinden yeni bir olay eklerken, bu timestamp'in doğru ve tutarlı olmasını sağlamak için
      manuel olarak eklememiz gerekiyor.
      Ayrıca bunu eklememek firestore'un kendi timestamp'ini render ederken sorunlara yol açıyor.
      */
    // If status is being updated to PUBLISHED, set publishedAt and publishedBy
    const updatePayload: any = {
      ...body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    try {
      const newStatus = body?.status
      if (newStatus === 'PUBLISHED') {
        updatePayload.publishedAt = admin.firestore.FieldValue.serverTimestamp()
        updatePayload.publishedBy = session.user?.id || session.user?.email || session.user?.username || null
        updatePayload.isPublished = true
      } else if (newStatus === 'UNPUBLISHED') {
        updatePayload.publishedAt = null
        updatePayload.publishedBy = null
        updatePayload.isPublished = false
      }
    } catch (e) {
      console.warn('Error while computing publish audit fields', e)
    }

    await firestoreAdmin.collection('blogs').doc(docId).update(updatePayload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post Update Error:', error)
    return NextResponse.json(
      { success: false, error: 'Güncelleme sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// YAZI SİLME (DELETE)
export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }
    const docId = resolvedParams?.id
    await firestoreAdmin.collection('blogs').doc(docId).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post Delete Error:', error)
    return NextResponse.json(
      { success: false, error: 'Silme sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}
