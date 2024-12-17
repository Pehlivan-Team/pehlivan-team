import React from "react";
import pehli1 from "@/assets/arabalar/pehli1.png";
import Image from "next/image";

const CurrentCar = () => {
  return (
    <div
      className="bg-[#265fc9] text-white flex flex-col-reverse lg:flex-row gap-10 lg:p-10 py-16"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/axiom-pattern.png')",
        accentColor: "#f65fc9",
      }}
    >
      <div className="w-[85vw] rounded-lg mx-10 border-4 border-white shadow-2xl shadow-slate-50">
        <Image src={pehli1} alt="car" width={1000} height={1000} />
      </div>
      <div className=" flex lg:flex-row flex-col gap-10 m-10 ">
        <div id="cardesc  " className="lg:w-[35vw]">
          <h1 className="text-4xl font-bold">Pehli1</h1>
          <div className="flex">
            TAKIM KAPTANI :<b>Fatih Coşar</b>
          </div>
          <h2>2024</h2>
          <p className="text-lg">
            Halihazırda geliştirilmekte olan Pehli1 Tubitak Efficiency Challenge
            yarışmasına hazırlanmaktadır
          </p>
          <br />
          <p>
            Pehli1 isimli aracımız, halen geliştirilmekte olup TÜBİTAK
            Efficiency Challenge yarışmasına hazırlanmaktadır. Bu yenilikçi
            araç, Li-ION piller ve Mitsuba marka motor içermekte olup, maksimum
            verimlilik hedefiyle tasarlanmıştır. Pehli1, enerji tasarrufu ve
            performans açısından üstün özelliklere sahip olup, sürdürülebilir
            ulaşım çözümleri sunmayı amaçlamaktadır. Bu araç, geleceğin çevre
            dostu ulaşım teknolojilerine öncülük etmeyi hedeflemektedir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentCar;
