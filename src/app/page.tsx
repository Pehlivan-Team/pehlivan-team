import React, { Suspense } from 'react'
import ContactSection from '@/components/main-page-components/ContactSection'
import FeaturedProjects from '@/components/main-page-components/FeaturedProjects'
import MainPageAboutCards from '@/components/main-page-components/MainPageAboutCards'
import MainPageAchievements from '@/components/main-page-components/MainPageAchievements'
import MainPageHeader from '@/components/main-page-components/MainPageHeader'
import MainPageProjects from '@/components/main-page-components/MainPageProjects'
import SponsorSlider from '@/components/main-page-components/SponsorSlider'
import WelcomeModalWrapper from '@/components/main-page-components/WelcomeModalWrapper'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { Project } from '@/types/projects'

// Sunucu tarafında rastgele 4 proje çeken fonksiyon
async function getRandomProjects(): Promise<Project[]> {
  const snapshot = await firestoreAdmin.collection('projects').get()
  if (snapshot.empty) {
    return []
  }
  const allProjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project)

  // Fisher-Yates shuffle algoritması ile diziyi rastgele karıştır
  for (let i = allProjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allProjects[i], allProjects[j]] = [allProjects[j], allProjects[i]]
  }

  const shuffledProjects = JSON.parse(JSON.stringify(allProjects))
  // İlk 4 tanesini al
  return shuffledProjects.slice(0, 4)
}

// Ana sayfa bileşenini 'async' olarak işaretliyoruz
export default async function Home() {
  const randomProjects = await getRandomProjects()

  return (
    <div className="bg-gray-950">
      <Suspense fallback={null}>
        <WelcomeModalWrapper />
      </Suspense>

      <MainPageHeader />
      <MainPageProjects projects={randomProjects} />
      <FeaturedProjects />
      <MainPageAchievements />
      <SponsorSlider />
      <ContactSection />
    </div>
  )
}
