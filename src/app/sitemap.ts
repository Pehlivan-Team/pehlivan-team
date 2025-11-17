import { MetadataRoute } from 'next'

import { teamsData } from '@/constants/teams'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Belirli bir süre sonra (örn: 24 saat) site haritasının yeniden oluşturulmasını sağlar
export const revalidate = 86400 // 24 hours in seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pehli1team.com'

  // 1. Statik sayfaları listeye ekle (güncellenmiş hali)
  const staticRoutes = [
    '/',
    '/projects', // '/cars' yerine '/projects'
    '/teams',
    '/timeline',
    '/add_member',
    '/shorten',
    '/liste',
    '/blog',
    '/feed',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  // 2. Dinamik blog yazılarını Firestore'dan çek
  const postsSnapshot = await firestoreAdmin
    .collection('blogs')
    .where('isPublished', '==', true)
    .get()

  const blogPostRoutes = postsSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      url: `${baseUrl}/blog/${data.slug}`,
      lastModified: data.updatedAt.toDate().toISOString(),
    }
  })

  // 3. Dinamik proje sayfalarını Firestore'dan çek
  const projectsSnapshot = await firestoreAdmin.collection('projects').get()
  const projectRoutes = projectsSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      url: `${baseUrl}/projects/${data.slug}`,
      lastModified: new Date().toISOString(), // Geliştirme: Projeye 'updatedAt' alanı eklenirse bu kullanılabilir
    }
  })

  // 4. Dinamik takım sayfalarını listeye ekle
  const teamRoutes = teamsData.map((team) => ({
    url: `${baseUrl}/teams/${team.slug}`,
    lastModified: new Date().toISOString(),
  }))

  // Tüm URL'leri birleştir ve geri döndür
  return [
    ...staticRoutes,
    ...blogPostRoutes,
    ...projectRoutes, // '/cars' yerine proje linklerini ekle
    ...teamRoutes,
  ]
}
