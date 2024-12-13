import React from "react";
import pehli1 from "@/assets/arabalar/pehli1.png";
import Image from "next/image";

const CurrentCar = () => {
  return (
    <div className="bg-[#265fc9] text-white flex flex-col-reverse lg:flex-row gap-10 lg:p-10 py-16 ">
         <div className="w-[500px] rounded-lg mx-10">
          <Image
            src={pehli1}
            alt="car"
            width={1000}
            height={1000}
          />
        </div>
      <div className=" flex lg:flex-row flex-col gap-10 m-10 ">
        <div id="cardesc  " className="lg:w-[35vw]">
          <h1 className="text-4xl font-bold">Pehli1</h1>
          <div className="flex">
            TAKIM KAPTANI :<b>Fatih Coşar</b>
          </div>
          <h2>2024</h2>
          <p>
            Halihazırda geliştirilmekte olan Pehli1 Tubitak Efficiency Challenge
            yarışmasına hazırlanmaktadır
          </p>
        </div>

     
      </div>
    </div>
  );
};

export default CurrentCar;
