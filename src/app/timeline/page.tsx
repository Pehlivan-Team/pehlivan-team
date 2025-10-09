"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { timelineEvents } from "@/constants/timelineData";
import { Calendar, Trophy } from "lucide-react";

const TimelinePage = () => {
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <header className="pt-32 pb-16 bg-[#101b40]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">Takım Tarihçemiz</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            2014'ten bugüne uzanan yolculuğumuzda elde ettiğimiz başarıları ve geliştirdiğimiz araçları keşfedin.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="relative">
          {/* The vertical line running through the timeline */}
          <div className="absolute left-1/2 w-0.5 h-full bg-slate-700 -translate-x-1/2" />

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              className="relative mb-12 flex items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemVariants}
            >
              <div className="hidden lg:block lg:w-1/2 pr-8 text-right">
                {index % 2 === 0 && (
                  <TimelineCard {...event} />
                )}
              </div>
              
              <div className="hidden lg:block lg:w-1/2 pl-8">
                {index % 2 !== 0 && (
                  <TimelineCard {...event} />
                )}
              </div>

              {/* Mobile View: Single Column */}
              <div className="block lg:hidden w-full pl-8">
                 <TimelineCard {...event} />
              </div>

              {/* The circle on the timeline */}
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-4 border-gray-950" />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

// A reusable card component for each timeline event
const TimelineCard = ({ year, title, description, image, awards }: typeof timelineEvents[0]) => (
  <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 shadow-lg">
    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
      <Image src={image} alt={title} layout="fill" objectFit="cover" />
    </div>
    <p className="text-red-400 font-semibold mb-1 flex items-center gap-2"><Calendar size={18} /> {year}</p>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-300 mb-4">{description}</p>
    {awards && (
      <div>
        <h4 className="font-semibold flex items-center gap-2"><Trophy size={18} className="text-yellow-400"/> Başarılar</h4>
        <ul className="list-disc list-inside text-gray-400 mt-1">
          {awards.map((award, i) => <li key={i}>{award}</li>)}
        </ul>
      </div>
    )}
  </div>
);

export default TimelinePage;