"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cars } from "@/constants";
import { ArrowRight } from "lucide-react";

// Animation variants for the container and individual cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // This will animate each child with a 0.2s delay
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

function MainPageCars() {
  return (
    <section id="cars" className="bg-[#13439c] w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Araçlarımız
        </h2>
        
        {/* Main container for staggered animations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cars.map((car, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link href={`/cars/${index}`}>
                <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-red-500 transition-all duration-300">
                  {/* Background Image */}
                  <Image
                    src={car.photos[0]}
                    alt={car.name + " photo"}
                    layout="fill"
                    objectFit="cover"
                    className="z-0 transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  
                  {/* Content */}
                  <div className="relative z-20 flex flex-col justify-end h-full p-6 text-white">
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
      </div>
    </section>
  );
}

export default MainPageCars;