import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/assets/logo_png.png";

export default function MainPageHeader() {  
    
  return (
    <div className="w-screen h-[100vh] justify-center align-middle flex items-center  flex-col">
      <motion.div
        className=" flex bg-white lg:w-80 lg:h-80 w-32 h-32 flex-row justify-center align-middle rounded-full"
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 0 }}
        initial={{ x: 200, opacity: 0 }}
        animate={{
          opacity: 1,
          x: 0,
          rotateZ: 360,
          scale: 1.5,
          transition: { duration: 1, ease: "circInOut", stiffness: 100 },
        }}
      >
        <Image draggable={false} src={logo} width={300} height={300} alt="Logo" />
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
        animate={{ opacity: 1, transition: { duration: 1, ease: "circInOut" } }}
      >
        Elektrikli araç teknolojisinin sınırlarını zorlayan üniversite projesi.
        Sürdürülebilir ulaşımda devrim yaratmamıza katılın.
      </motion.p>
    </div>
  );
}
