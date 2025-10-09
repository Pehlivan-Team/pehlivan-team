"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cars } from "@/constants";
import { ArrowRight } from "lucide-react";

// Animation variants for a staggered fade-in effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

function CarsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <header className="pt-32 pb-16 bg-[#13439c]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">Araç Galerimiz</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            Yıllar boyunca geliştirdiğimiz, her biri yenilik ve mühendislik tutkumuzun birer kanıtı olan araçlarımızı keşfedin.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cars.map((car, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }} // Lifts the card on hover
              className="group"
            >
              <Link href={`/cars/${index}`}>
                <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-slate-800 hover:border-red-500 transition-all duration-300">
                  <Image
                    src={car.photos[0]}
                    alt={`${car.name} photo`}
                    layout="fill"
                    objectFit="cover"
                    className="z-0 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                  <div className="relative z-20 flex flex-col justify-end h-full p-6">
                    <h3 className="text-2xl font-bold">{car.name}</h3>
                    <p className="text-lg text-gray-300">{car.year}</p>
                    <div className="flex items-center mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Detayları Gör</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

export default CarsPage;