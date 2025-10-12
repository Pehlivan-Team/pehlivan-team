import { firestoreAdmin } from "@/lib/firebase-admin";
import { Project } from "@/types/projects";
import MainPageHeader from "@/components/main-page-components/MainPageHeader";
import MainPageAboutCards from "@/components/main-page-components/MainPageAboutCards";
import MainPageProjects from "@/components/main-page-components/MainPageProjects";
import FeaturedProjects from "@/components/main-page-components/FeaturedProjects";
import MainPageAchievements from "@/components/main-page-components/MainPageAchievements";
import SponsorSlider from "@/components/main-page-components/SponsorSlider";
import ContactSection from "@/components/main-page-components/ContactSection";
import WelcomeModalWrapper from "@/components/main-page-components/WelcomeModalWrapper";

// Sunucu tarafında rastgele 4 proje çeken fonksiyon
async function getRandomProjects(): Promise<Project[]> {
  const snapshot = await firestoreAdmin.collection("projects").get();
  if (snapshot.empty) {
    return [];
  }
  const allProjects = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Project)
  );

  // Fisher-Yates shuffle algoritması ile diziyi rastgele karıştır
  for (let i = allProjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProjects[i], allProjects[j]] = [allProjects[j], allProjects[i]];
  }

  // İlk 4 tanesini al
  return allProjects.slice(0, 4);
}

// Ana sayfa bileşenini 'async' olarak işaretliyoruz
export default async function Home() {
  const randomProjects = await getRandomProjects();

  return (
    <div className="bg-gray-950">
      <WelcomeModalWrapper />

      <MainPageHeader />
      <MainPageAboutCards />
      <MainPageProjects projects={randomProjects} />
      <FeaturedProjects />
      <MainPageAchievements />
      <SponsorSlider />
      <ContactSection />
    </div>
  );
}
