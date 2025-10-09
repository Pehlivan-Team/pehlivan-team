"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, BatteryCharging, CircuitBoard, Wrench } from "lucide-react";
import pehli1 from "@/assets/arabalar/pehli1.png";

// 1. All car data is now in one place for easy updates.
const currentCarData = {
  name: "Pehli1",
  year: 2024,
  captain: "Fatih Coşar , Eşref Kaan Kurtoğlu",
  longDescription: "Bu yenilikçi araç, yerli Aspilsan Li-ION piller ve yüksek verimli Mitsuba motor içermekte olup, maksimum verimlilik hedefiyle tasarlanmıştır. Pehli1, enerji tasarrufu ve performans açısından üstün özelliklere sahip olup, sürdürülebilir ulaşım çözümleri sunmayı amaçlamaktadır.",
  image: pehli1,
  specifications: [
    {
      Icon: BatteryCharging,
      label: "Batarya",
      value: "Aspilsan Li-ION",
    },
    {
      Icon: Wrench,
      label: "Motor",
      value: "Mitsuba M2096 Motor",
    },
    {
      Icon: CircuitBoard,
      label: "Geliştirme",
      value: "Elektronik , Yazılım , Mekanik , Aerodinamik , Tasarım",
    },
    {
      Icon: Award,
      label: "Hedef Yarışma",
      value: "Shell Eco Marathon",
    },
  ],
};

// Animation variants for different elements
const imageVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const textVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
};

const specsContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
};
  
const specItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const CurrentCar = () => {
  return (
    // 2. Improved layout, styling, and animations.
    <section
      className="bg-[#265fc9] text-white py-16 lg:py-24"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/axiom-pattern.png')",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Car Details */}
          <motion.div 
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <div>
              <p className="text-red-400 font-semibold">GÜNCEL PROJEMİZ</p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-1">{currentCarData.name}</h1>
              <p className="text-xl text-gray-300 mt-1">{currentCarData.year}</p>
              <p className="mt-2 text-lg">Takım Kaptanı: <b>{currentCarData.captain}</b></p>
            </div>
            <p className="text-gray-200 leading-relaxed">{currentCarData.longDescription}</p>
            
            {/* 3. New "Specifications" section with icons. */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-2xl font-semibold mb-4">Teknik Özellikler</h3>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={specsContainerVariants}
              >
                {currentCarData.specifications.map((spec, index) => (
                  <motion.div key={index} className="flex items-center gap-4" variants={specItemVariants}>
                    <spec.Icon className="h-10 w-10 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-lg">{spec.label}</p>
                      <p className="text-gray-300">{spec.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Car Image (reversed on mobile) */}
          <motion.div 
            className="flex justify-center row-start-1 lg:row-start-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
          >
            <Image
              src={currentCarData.image}
              alt={currentCarData.name}
              width={800}
              height={600}
              className="rounded-lg border-4 border-white shadow-2xl shadow-black/50 object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CurrentCar;