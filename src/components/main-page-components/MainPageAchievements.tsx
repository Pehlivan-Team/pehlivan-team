"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

// Data is now in an array, making it easier to add new achievements.
const achievementsList = [
  {
    event: "Tübitak Efficiency Challenge - 2015",
    award: "Tasarım Ödülü",
  },
  {
    event: "FormulaG Güneş Arabaları Yarışı - 2014",
    award: "Kurul Özel Ödülü",
  },
  {
    event: "FormulaG Güneş Arabaları Yarışı - 2014",
    award: "Üçüncülük Ödülü",
  },
  {
    event: "Tübitak Efficiency Challenge - 2016",
    award: "İkincilik Ödülü",
  },
  {
    event: "Tübitak Efficiency Challenge - 2016",
    award: "Communication Award - En İyi Sunum Ödülü",
  },
];

// Animation variants for the container and individual cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animates cards one by one
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

const MainPageAchievements = () => {
  return (
    <section id="achievements" className="bg-[#101b40] w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-white">
          Başarılarımız
        </h2>
        {/* Framer Motion container to animate cards into view */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {achievementsList.map((achievement, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-slate-800/60 border-blue-400 text-white h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/50 shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{achievement.event}</h3>
                  <p className="text-gray-300">{achievement.award}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MainPageAchievements;