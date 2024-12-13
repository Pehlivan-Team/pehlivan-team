import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Award, BatteryChargingIcon, ZapIcon } from "lucide-react";

const cards: { icon: any; title: string; description: string }[] = [
  {
    icon: Award,
    title: "Ödüllü Tasarım",
    description:
      "Form ve işlevi birleştiren şık, aerodinamik araçlar yaratıyoruz.",
  },
  {
    icon: BatteryChargingIcon,
    title: "Yenilikçi Batarya Teknolojisi",
    description:
      "Uzun menzil ve daha hızlı şarj için ileri teknoloji batarya çözümleri geliştiriyoruz.",
  },
  {
    icon: ZapIcon,
    title: "Verimli Motorlar",
    description:
      "Gücü ve verimliliği optimize etmek için yüksek verimli Mitsuba motorları kullanıyoruz.",
  },
];

export default function MainPageAboutCards() {
  return (
    <section className="bg-[#101b40] text-white py-32 gap-8 flex flex-col lg:flex-row justify-center px-10">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="bg-card sm:w-[85vw] lg:w-1/4 border-green-400"
        >
          <CardContent>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1  , rotateZ : 360} }
              transition={{ duration:1  }}
              whileHover={{ scale: 1.1 , rotateZ : 720}}
              className="flex items-center justify-center w-16 h-16 bg-green-400 rounded-full"
            >
              {React.createElement(card.icon, {
                size: 32,
                color: "white",
              })}
            </motion.div>
            <h3 className="text-lg font-semibold mt-4">{card.title}</h3>
            <p className="mt-2">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
