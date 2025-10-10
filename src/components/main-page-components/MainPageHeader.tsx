"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo_png.png";
import bg from "@/public/bg.jpg";

// Animation variants for staggering the entrance of elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export default function MainPageHeader() {
  const scrollToNextSection = () => {
    // Scrolls the user to the first section after the hero
    const firstSection = document.querySelector("section");
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg}
          layout="fill"
          objectFit="cover"
          alt="Pehlivan Team background"
          className="opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/70 to-transparent" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Draggable Logo */}
        <motion.div
          drag
          dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
          dragElastic={0.2}
          whileHover={{ scale: 1.1, rotateZ: 5 }}
          className="cursor-grab active:cursor-grabbing bg-white/70 p-2 backdrop-blur-sm rounded-full"
          variants={itemVariants}
        >
          <Image
            draggable={false}
            src={logo}
            width={200}
            height={200}
            alt="Pehlivan Team Logo"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-7xl"
          variants={itemVariants}
        >
          Pehlivan Team
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 max-w-2xl text-lg text-gray-300 md:text-xl"
          variants={itemVariants}
        >
          Sürdürülebilir teknoloji ve yenilikçi mühendislik ile geleceğin
          sınırlarını zorluyoruz.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <Button
            asChild
            size="lg"
            className="bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-105 shadow-lg"
          >
            <Link href="/add_member">Topluluğa Katıl</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black transition-transform hover:scale-105 shadow-lg"
            onClick={scrollToNextSection}
          >
            Daha Fazlasını Keşfet
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{
          delay: 2.5,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <ArrowDown className="h-8 w-8 text-white" />
      </motion.div>
    </div>
  );
}
