import React from "react";
import logo from "@/assets/logo_png.png";
import Image from "next/image";
const Topbar = () => {
  return (
    <div className="bg-gray-950 text-white w-screen h-16">
      <div className="flex justify-between items-center h-full px-4">
        <a href="/">
          <Image src={logo} alt="Logo" className="h-10 w-10" />
        </a>
        <h1 className="text-2xl"></h1>
        <div className="flex space-x-4">
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
      </div>
    </div>
  );
};

export default Topbar;
