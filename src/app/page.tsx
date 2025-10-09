"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

// Import all your main page components
import MainPageHeader from "@/components/main-page-components/MainPageHeader";
import MainPageAboutCards from "@/components/main-page-components/MainPageAboutCards";
import MainPageAchievements from "@/components/main-page-components/MainPageAchievements";
import MainPageCars from "@/components/main-page-components/MainPageCars";
import CurrentCar from "@/components/main-page-components/CurrentCar";
import SponsorSlider from "@/components/main-page-components/SponsorSlider";
import WelcomeModal from "@/components/main-page-components/WelcomeModal";
import ContactSection from "@/components/main-page-components/ContactSection";
import FeaturedProjects from "@/components/main-page-components/FeaturedProjects";

export default function Home() {
  const searchParams = useSearchParams();
  const showModal = searchParams.has("welcome");

  return (
    // The h-screen class was removed here to fix the layout issue.
    // I also removed w-screen and overflow-x-clip as they are handled by the layout.
    <div className="bg-gray-950 overflow-x-clip text-white">
      <WelcomeModal show={showModal} />

      {/* --- SECTIONS --- */}
      <MainPageHeader />
      <SponsorSlider />
      <MainPageAboutCards />
      <MainPageAchievements />
      <MainPageCars />
     {/*  <CurrentCar /> */}
      <FeaturedProjects />
      <ContactSection />
    </div>
  );
}
