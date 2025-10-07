"use client";
import Motion from "@/components/motion/drag-on-load";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, BatteryCharging, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { members } from "@/constants/members";
import React from "react";
import MainPageHeader from "@/components/main-page-components/MainPageHeader";
import MainPageAboutCards from "@/components/main-page-components/MainPageAboutCards";
import MainPageCars from "@/components/main-page-components/MainPageCars";
import { useScroll } from "framer-motion";

import { motion } from "framer-motion";
import CurrentCar from "@/components/main-page-components/CurrentCar";
import MainPageAchievements from "@/components/main-page-components/MainPageAchievements";
import SponsorSlider from "@/components/main-page-components/SponsorSlider";
import WelcomeModal from "@/components/main-page-components/WelcomeModal";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const membersArray = JSON.parse(JSON.stringify(members));
  const searchParams = useSearchParams();
  const showModal = searchParams.has("welcome");

  return (
    <div className="bg-gray-950 h-screen w-screen overflow-x-clip ">
      <WelcomeModal show={showModal} />

      <MainPageHeader />

      <SponsorSlider />

      <MainPageAboutCards />

      <MainPageCars />

      <CurrentCar />

      <MainPageAchievements />

      <section id="team" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="pl-2 pr-2 px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Ekibimizle Tanışın
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {membersArray.map((member: any) => (
              <a key={member.name} className="" href={`/members/${member.id}`}>
                <Card key={member.name} className="h-60">
                  <CardContent className="flex flex-col items-center space-y-2 p-6">
                    <div className="w-24 h-24 rounded-full bg-gray-300">
                      <Image
                        src={member.img}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {member.role.split("/")
                        ? member.role.split("/")[0]
                        : member.role}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="w-full py-12 md:py-24 lg:py-32 bg-black text-white"
      >
        <div className="pl-2 pr-2 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Yolculuğumuza Katılın
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                Elektrikli araçlar ve sürdürülebilir teknolojiyle ilgileniyor
                musunuz? Daha fazla bilgi almak veya ekibimize katılmak için
                bizimle iletişime geçin!
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2"></div>
            <Button asChild className=" bg-white text-black hover:bg-gray-200">
              <a href="mailto:pehli1team@gmail.com" className="text-black">
                Bize Ulaşın
              </a>
            </Button>
            <div className="flex flex-col pb-10">
              <div>
                Takım Kaptanı <br />
                <a href="tel:+905307617004" className="font-bold ">
                  Eşref Kaan Kurtoğlu : +90 530 761 7004
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
