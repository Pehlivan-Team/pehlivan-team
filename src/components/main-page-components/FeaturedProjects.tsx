"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Award,
  BatteryCharging,
  CircuitBoard,
  Wrench,
  Cpu,
  ScanLine,
  Rocket as RocketIcon,
  Satellite,
} from "lucide-react";
import pehli1 from "@/assets/arabalar/pehli1.png";
import börü from "@/assets/placeholder_BORU.jpg";
import roket from "@/assets/placeholder_ROCKET.jpg";

// --- UPDATED DATA ---
// Each project now has a 'specifications' array.
const featuredProjectsData = [
  {
    category: "GÜNCEL ELEKTRİKLİ ARAÇ PROJESİ",
    name: "Pehli1",
    description:
      "TÜBİTAK Efficiency Challenge için geliştirdiğimiz son elektrikli aracımız. Yerli motor sürücü, batarya yönetim sistemi ve kompozit gövde teknolojileriyle maksimum verimlilik hedefliyoruz.",
    image: pehli1,
    leader: "Fatih Coşar",
    specifications: [
      {
        Icon: BatteryCharging,
        label: "Batarya",
        value: "Li-ION Pil Teknolojisi",
      },
      { Icon: Wrench, label: "Motor", value: "Mitsuba Marka Elektrikli Motor" },
      {
        Icon: CircuitBoard,
        label: "Elektronik",
        value: "Yerli Tasarım BMS ve Motor Sürücü",
      },
      { Icon: Award, label: "Hedef", value: "TÜBİTAK Efficiency Challenge" },
    ],
  },
  {
    category: "OTONOM TEKNOLOJİSİ",
    name: "Börü Otonom Araç",
    description:
      "Yapay zeka ve sensör füzyonu ile kendi kendine sürüş kabiliyeti kazandırdığımız otonom aracımız. Teknofest Robotaksi yarışmasına katılım için geliştirilmektedir.",
    image: börü,
    leader: "Belirlenecek",
    specifications: [
      { Icon: ScanLine, label: "Sensörler", value: "LIDAR, Kamera, IMU" },
      { Icon: Cpu, label: "İşlemci", value: "Yüksek Performanslı Gömülü GPU" },
      {
        Icon: CircuitBoard,
        label: "Yazılım",
        value: "Yapay Zeka ve Görüntü İşleme",
      },
      { Icon: Award, label: "Hedef", value: "Teknofest Robotaksi" },
    ],
  },
  {
    category: "UZAY VE HAVACILIK",
    name: "Pehlivan Roket Takımı",
    description:
      "Görev yükünü taşımak ve roketi başarılı şekilde indirmek amacıyla tasarlanan roket projemiz.",
    image: roket,
    leader: "Belirlenecek",
    specifications: [
      { Icon: RocketIcon, label: "İrtifa Hedefi", value: "15.000 feet" },
      { Icon: Wrench, label: "İtki", value: "Katı Yakıtlı Roket Motoru" },
      {
        Icon: Satellite,
        label: "Aviyonik",
        value: "Yerli Tasarım Uçuş Bilgisayarı",
      },
      { Icon: Award, label: "Hedef", value: "Teknofest Roket Yarışması" },
    ],
  },
];

// Animation variants for specs
const specsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const specItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const FeaturedProjects = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect(); // Set initial state

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      className="bg-[#265fc9] text-white py-16 lg:py-24"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/axiom-pattern.png')",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Öne Çıkan Projelerimiz
          </h2>
        </div>
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent>
            {featuredProjectsData.map((project, index) => (
              <CarouselItem key={index}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Text Content */}
                  <div className="space-y-4 lg:row-start-1 row-start-2">
                    <p className="font-semibold text-red-400">
                      {project.category}
                    </p>
                    <h3 className="text-4xl lg:text-5xl font-bold">
                      {project.name}
                    </h3>
                    <p className="text-lg">
                      Takım Lideri: <b>{project.leader}</b>
                    </p>
                    <p className="text-gray-200 leading-relaxed pt-2">
                      {project.description}
                    </p>

                    {/* -- SPECIFICATIONS SECTION -- */}
                    <div className="pt-4 mt-4 border-t border-white/20">
                      <h4 className="text-xl font-semibold mb-4">
                        Teknik Özellikler
                      </h4>
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"
                        initial="hidden"
                        // Animate only when this slide is active
                        animate={current === index ? "visible" : "hidden"}
                        variants={specsContainerVariants}
                      >
                        {project.specifications.map((spec, specIndex) => (
                          <motion.div
                            key={specIndex}
                            className="flex items-center gap-3"
                            variants={specItemVariants}
                          >
                            <spec.Icon className="h-8 w-8 text-red-400 flex-shrink-0" />
                            <div>
                              <p className="font-semibold">{spec.label}</p>
                              <p className="text-gray-300 text-sm">
                                {spec.value}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                  {/* Image */}
                  <div className="lg:row-start-1 row-start-1 flex justify-center">
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={800}
                      height={600}
                      className="rounded-lg border-4 border-white shadow-2xl shadow-black/50 object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {featuredProjectsData.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  current === index
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Proje ${index + 1}'e git`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProjects;
