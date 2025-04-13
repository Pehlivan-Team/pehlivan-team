"use client";
import React from "react";
import logo from "@/assets/logo_png.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
const Topbar = () => {
  return (
    <div className=" bg-gray-950 ">
      <div className="bg-[#ff0620] z-10 text-white w-screen h-16 fixed hidden lg:block rounded-b-3xl md:pr-24 md:pl-12">
        <nav className="flex  bg-transparent  justify-between items-center h-16 px-4">
          <motion.a
            initial={{ rotateZ: 0 }}
            whileHover={{ rotateZ: 360 }}
            transition={{ duration: 0.7, ease: "circInOut" }}
            href="/"
            className="bg-white rounded"
          >
            <Image src={logo} alt="Logo" className="h-10 w-10" />
          </motion.a>
          <h1 className="text-2xl"></h1>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/pehlivanteam"
              className="text-white"
            >
              <InstagramLogoIcon className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/pehlivan-team/"
              className="text-white"
            >
              <LinkedInLogoIcon className="h-6 w-6" />
            </a>
            <a href="/#achievements" className="text-white">
              Başarılarımız
            </a>
            <a href="/members" className="text-white">
              Takım
            </a>
            <a href="/#contact" className="text-white">
              Bize Ulaş
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

const BottomBar = () => {
  return (
    <div className="bg-[#ff0620] z-20 text-white w-screen h-16 fixed bottom-0 lg:hidden rounded-t-3xl md:pr-24 md:pl-12 print:hidden">
      <nav className="flex   bg-transparent  justify-between items-center h-16 px-4">
        <motion.a
          initial={{ rotateZ: 0 }}
          whileHover={{ rotateZ: 360 }}
          transition={{ duration: 0.7, ease: "circInOut" }}
          href="/"
          className="bg-white rounded"
        >
          <Image src={logo} alt="Logo" className="h-10 w-10" />
        </motion.a>
        <h1 className="text-2xl"></h1>
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/pehlivanteam"
            className="text-white"
          >
            <InstagramLogoIcon className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/company/pehlivan-team/"
            className="text-white"
          >
            <LinkedInLogoIcon className="h-6 w-6" />
          </a>
          <a href="/#achievements" className="text-white">
            Başarılarımız
          </a>
          <a href="/members" className="text-white">
            Takım
          </a>
          <a href="/#contact" className="text-white">
            Bize Ulaş
          </a>
        </div>
      </nav>
    </div>
  );
};

export { Topbar, BottomBar };
