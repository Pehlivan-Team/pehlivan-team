import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Award, BatteryChargingIcon, ZapIcon } from "lucide-react";
export default function MainPageAboutCards() {
  return (
    <section
      id="about"
      className="flex w-screen py-12 md:py-24 lg:py-32 bg-black justify-center align-middle text-center overflow-x-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{
            y: 200,
            opacity: 0,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 1, ease: "circInOut" },
          }}
        >
          <Card className="border-blue-300 w-[85vw]">
            <CardContent className="flex flex-col items-center space-y-2 p-6">
              <Award className="h-12 w-12 text-red-600" />
              <h3 className="text-xl font-bold text-white">Ödüllü Tasarım</h3>
              <p className="text-center text-white">
                Form ve işlevi birleştiren şık, aerodinamik araçlar yaratıyoruz.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{
            y: 200,
            opacity: 0,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 1, ease: "circInOut" },
          }}
        >
          <Card className="border-blue-300 w-[85vw]">
            <CardContent className="flex flex-col items-center space-y-2 p-6">
              <BatteryChargingIcon className="h-12 w-12 text-green-600" />
              <h3 className="text-xl font-bold text-white">
                Yenilikçi Batarya Teknolojisi
              </h3>
              <p className="text-center text-white">
                Uzun menzil ve daha hızlı şarj için ileri teknoloji batarya
                çözümleri geliştiriyoruz.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{
            y: 200,
            opacity: 0,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 1, ease: "circInOut" },
          }}
        >
          <Card className="border-blue-300 w-[85vw]">
            <CardContent className="flex flex-col items-center space-y-2 p-6">
              <ZapIcon className="h-12 w-12 text-orange-500" />
              <h3 className="text-xl font-bold text-white">Verimli Motorlar</h3>
              <p className="text-center text-white">
                Gücü ve verimliliği optimize etmek için yüksek verimli Mitsuba
                motorları kullanıyoruz.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
