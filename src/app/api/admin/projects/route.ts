import admin from 'firebase-admin'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// YENİ PROJE OLUŞTURMA (POST)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.permissions?.canManageProjects) {
      return NextResponse.json({ success: false, error: 'Yetkiniz yok.' }, { status: 403 })
    }
    const body = await request.json()
    /*
      createdAt: admin.firestore.FieldValue.serverTimestamp(), kısmı önemli.
      Bu, Firestore'da olayın oluşturulma zamanını doğru bir şekilde kaydetmek için kullanılır.
      Klasik JS Date objesi ile de timestamp oluşturulabilir ancak bu durumda istemci ve sunucu saat dilimi farklılıkları
      nedeniyle tutarsızlıklar yaşanabilir. Bu yüzden Firestore'un kendi timestamp'ini kullanmak en iyisidir.
      Peki zaten firestore'da createdAt alanı var, neden bir de biz ekliyoruz?
      Çünkü firestore'un kendi timestamp'i, veritabanına veri eklenirken otomatik olarak oluşturulur.
      Ancak biz API üzerinden yeni bir olay eklerken, bu timestamp'in doğru ve tutarlı olmasını sağlamak için
      manuel olarak eklememiz gerekiyor.
      Ayrıca bunu eklememek firestore'un kendi timestamp'ini render ederken sorunlara yol açıyor.
      */
    const newProject = await firestoreAdmin
      .collection('projects')
      .doc(body.slug)
      .set({
        ...body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    // Proje oluşturulduktan sonra ilgili sayfaları önbellekten temizle
    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${body.slug}`)
    revalidatePath(`/admin/projects/${body.slug}`)

    return NextResponse.json({ success: true, id: body.slug })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Bilinmeyen bir hata oluştu.' },
      { status: 500 }
    )
  }
}
