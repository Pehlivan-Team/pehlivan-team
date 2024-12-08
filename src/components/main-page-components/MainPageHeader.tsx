"use client";
import React from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import logo from "@/assets/logo_png.png";
import { Button } from "@/components/ui/button";

export default function MainPageHeader() {
  const dragControl = useDragControls();

  const [pehliLogo, setPehliLogo] = React.useState(true);

  return (
    <div className="w-screen h-[100vh] justify-center align-middle flex items-center  flex-col bg-teal-950">
      <motion.div
        drag={pehliLogo}
        dragElastic={0.3}
        dragSnapToOrigin={pehliLogo}
        dragControls={dragControl}
        dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
        className="bg-white"
        animate={{
          opacity: [0, 1, 1, 1, 1],
          scale: [1, 2, 2, 1, 1],
          rotate: [180, 0, 0, 360, 360],
          borderRadius: ["0%", "0%", "50%", "50%", "100%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <Image
          draggable={false}
          src={logo}
          width={300}
          height={300}
          alt="Logo"
        />
      </motion.div>
      <motion.h1
        className="text-white text-3xl my-24"
        initial={{ x: 0, y: -200, opacity: 0 }}
        animate={{
          x: 0,
          y: 0,
          opacity: 1,
          transition: { duration: 3, ease: "circInOut" },
        }}
      >
        Pehlivan Team
      </motion.h1>
      <motion.p
        className="text-white text-xl text-center"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 1, ease: "circInOut" },
        }}
      >
        Elektrikli araç teknolojisinin sınırlarını zorlayan üniversite projesi.
        Sürdürülebilir ulaşımda devrim yaratmamıza katılın.
      </motion.p>
    </div>
  );
}
