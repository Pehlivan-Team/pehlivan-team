import admin from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// YENİ YAZI OLUŞTURMA (POST)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, isPublished, imageUrl, slug } = body

    if (!title || !content || !slug) {
      return NextResponse.json(
        { success: false, error: 'Başlık, içerik ve slug zorunludur.' },
        { status: 400 }
      )
    }
    /*
      createdAt: admin.firestore.FieldValue.serverTimestamp(), ve
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
    const newPost = await firestoreAdmin.collection('posts').add({
      ...body,
      author: session.user.name,
      authorImage: session.user.image,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // İçerik oluşturulduktan sonra ilgili sayfaları önbellekten temizle
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath(`/admin/blog`)
    revalidatePath(`/admin/blog/${newPost.id}`)

    return NextResponse.json({ success: true, id: newPost.id })
  } catch (error) {
    console.error('Post Create Error:', error)
    return NextResponse.json(
      { success: false, error: 'Bilinmeyen bir hata oluştu.' },
      { status: 500 }
    )
  }
}
