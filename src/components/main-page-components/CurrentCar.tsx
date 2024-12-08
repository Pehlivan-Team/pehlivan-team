import React from "react";
import pehli1 from "@/assets/arabalar/pehli1.png";
import Image from "next/image";

const CurrentCar = () => {
  return (
    <section className="w-screen flex justify-center py-5 ">
      <div>
        <h1 className="text-5xl font-bold">PEHLI1</h1>

        <div className="flex gap-5">
          <h2 className="text-3xl font-bold">Takım Kaptanı</h2>
          <h3 className="text-2xl">Fatih Coşar</h3>
        </div>

        <Image src={pehli1} alt="pehli1" width={500} height={500} />
      </div>
    </section>
  );
};

export default CurrentCar;
