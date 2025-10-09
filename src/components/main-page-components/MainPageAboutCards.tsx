"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Award, BatteryChargingIcon, ZapIcon } from "lucide-react";

// Card data is kept in an array for easy maintenance
const cardsData = [
  {
    icon: Award,
    title: "Ödüllü Tasarım",
    description: "Form ve işlevi birleştiren şık, aerodinamik araçlar yaratıyoruz.",
  },
  {
    icon: BatteryChargingIcon,
    title: "Yenilikçi Batarya Teknolojisi",
    description: "Uzun menzil ve daha hızlı şarj için ileri teknoloji batarya çözümleri geliştiriyoruz.",
  },
  {
    icon: ZapIcon,
    title: "Verimli Motorlar",
    description: "Gücü ve verimliliği optimize etmek için yüksek verimli Mitsuba motorları kullanıyoruz.",
  },
];

// Animation variants for the container and individual cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animates cards one after the other
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
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(255, 6, 32, 0.3)", // Red glow effect
  }
};

export default function MainPageAboutCards() {
  return (
    <section className="bg-[#101b40] text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          Neden Öne Çıkıyoruz?
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {cardsData.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="h-full"
            >
              <Card className="bg-slate-800/60 border-slate-700 h-full text-left p-4 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      {React.createElement(card.icon, {
                        className: "w-8 h-8 text-white",
                      })}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-300">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}