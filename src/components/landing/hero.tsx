"use client";
import Image from "next/image";
import React from "react";
import { Monomaniac_One } from "next/font/google";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Reveal } from "../reveal";

const monomanFont = Monomaniac_One({ subsets: ["latin"], weight: ["400"] });
const Hero = () => {
  return (
    <div
      className={cn(
        monomanFont.className,
        "flex bg-black w-screen h-[75vh] justify-center items-center md:flex-row flex-col py-36 px-5"
      )}
    >
      <Reveal width="fit-content">
        <Image
          src={"/img/PehlivanLogo.png"}
          alt="Pehlivan Logo"
          width={300}
          height={300}
          className="object-fill w-full h-full"
        />
      </Reveal>
      <Reveal width="fit-content" left={true}>
        <h1 className="text-white text-8xl font-bold">Pehlivan Team</h1>
      </Reveal>
    </div>
  );
};

export default Hero;
