"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Trophy } from "lucide-react";
import { TimelineEvent } from "../page";

// Bu bileşen, önceki page.tsx dosyasındaki istemci taraflı mantığı içerir.
export const TimelineClientPage = ({ events }: { events: TimelineEvent[] }) => {
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <main className="container mx-auto py-16 px-4">
      <div className="relative">
        <div className="absolute left-1/2 w-0.5 h-full bg-slate-700 -translate-x-1/2" />
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="relative mb-12 flex items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
          >
            <div className="hidden lg:block lg:w-1/2 pr-8 text-right">
              {index % 2 === 0 && <TimelineCard {...event} />}
            </div>
            <div className="hidden lg:block lg:w-1/2 pl-8">
              {index % 2 !== 0 && <TimelineCard {...event} />}
            </div>
            <div className="block lg:hidden w-full pl-8">
              <TimelineCard {...event} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-4 border-gray-950" />
          </motion.div>
        ))}
      </div>
    </main>
  );
};

const TimelineCard = (event: TimelineEvent) => (
  <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 shadow-lg">
    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
      <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" />
    </div>
    <p className="text-red-400 font-semibold mb-1 flex items-center gap-2"><Calendar size={18} /> {event.year}</p>
    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
    <p className="text-gray-300 mb-4">{event.description}</p>
    {event.awards && (
      <div>
        <h4 className="font-semibold flex items-center gap-2"><Trophy size={18} className="text-yellow-400"/> Başarılar</h4>
        <ul className="list-disc list-inside text-gray-400 mt-1">
          {event.awards.map((award, i) => <li key={i}>{award}</li>)}
        </ul>
      </div>
    )}
  </div>
);