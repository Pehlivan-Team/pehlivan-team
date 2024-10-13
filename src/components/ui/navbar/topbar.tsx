import React from "react";
import logo from "@/assets/logo_png.png";
import Image from "next/image";
const Topbar = () => {
  return (
    <div className="bg-gray-950 text-white w-screen h-16">
      <div className="flex justify-between items-center h-full px-4">
        <Image src={logo} alt="Logo" className="h-10 w-10" />
        <h1 className="text-2xl">Pehlivan Team</h1>
        <div className="flex space-x-4">
          <a href="#" className="text-white">
            Home
          </a>
          <a href="#" className="text-white">
            About
          </a>
          <a href="#" className="text-white">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
