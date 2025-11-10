import admin from 'firebase-admin'
import { nanoid } from 'nanoid'

import { firestoreAdmin } from '@/lib/firebase-admin'

export async function createShortLink(longUrl: string, requestHeaders: Headers): Promise<string> {
  try {
    new URL(longUrl)
  } catch (error) {
    throw new Error('Geçersiz URL formatı.')
  }

  const slug = nanoid(7)

  try {
    // Admin SDK'sını kullanarak Firestore'a eriş
    const linksCollectionRef = firestoreAdmin.collection('links')

    // Admin SDK'sının 'add' yöntemini kullanarak yeni bir belge ekle
    await linksCollectionRef.add({
      slug: slug,
      longUrl: longUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // Kısa linki oluştur.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://pehli1team.com`
    return `${baseUrl}/s/${slug}`
  } catch (error) {
    console.error('Firestore (Admin) write error:', error)
    throw new Error('Kısa link oluşturulurken bir veritabanı hatası oluştu.')
  }
}
