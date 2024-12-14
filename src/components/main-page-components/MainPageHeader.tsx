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
import bg from "@/assets/bg.jpg";
import { Button } from "@/components/ui/button";

export default function MainPageHeader() {
  const [switchAnim, setSwitchAnim] = React.useState(false);

  const createRandomBubbleArray = () => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push({
        x: Math.random() * 10,
        y: Math.random() * 10,
      });
    }
    return arr;
  };

  const [bubbles, setBubbles] = React.useState(createRandomBubbleArray());

  setTimeout(() => {
    setSwitchAnim(true);
  }, 2000);
  return (
    <div className="w-screen h-[100vh] justify-center align-middle flex items-center flex-col bg-gray-950 lg:flex-row lg:justify-around lg:items-center">
      <div className="absolute inset-0 z-0">
        <Image src={bg} layout="fill" objectFit="cover" alt="bg" className="opacity-20" />
      </div>
      <div className="flex flex-col items-center">
        <motion.div
          id="logo"
          drag
          dragElastic={0.3}
          dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
          className="bg-white"
          variants={{
            initial: {
              opacity: [0, 1, 1, 1, 1],
              scale: [1, 2, 2, 1, 1],
              rotate: [180, 0, 0, 360, 360],
              borderRadius: ["0%", "0%", "50%", "50%", "100%"],
            },
            bubble: {
              x: bubbles.map((_, i) => bubbles[i].x),
              y: bubbles.map((_, i) => bubbles[i].y),
            },
          }}
          animate={switchAnim ? "bubble" : "initial"}
          transition={{
            duration: switchAnim ? 100 : 2,
            ease: "easeInOut",
            repeatType: "loop",
            repeat: Infinity,
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
      </div>
      <div className="flex flex-col items-center">
        <motion.p
          className="text-white text-xl text-center lg:w-[50vw] "
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "circInOut" },
          }}
        >
          Elektrikli araç teknolojisinin sınırlarını zorlayan üniversite
          projesi. Sürdürülebilir ulaşımda devrim yaratmamıza katılın.
        </motion.p>
        <div className="flex flex-row gap-10 ">
          <Button
            variant={"link"}
            className="mt-10 bg-white"
            onClick={() => {
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }}
          >
            Daha Fazla
          </Button>
          <Button
            variant={"link"}
            className="mt-10 bg-white"
            onClick={() => {
              window.scrollTo({ top: 9999, behavior: "smooth" });
            }}
          >
            İletişime Geçin
          </Button>
        </div>
      </div>
    </div>
  );
}
