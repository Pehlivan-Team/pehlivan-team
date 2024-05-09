"use client";
import Hero from "@/components/landing/hero";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { Reveal } from "@/components/reveal";
export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="flex flex-col items-center justify-center w-full p-10">
        <h2 className="text-4xl font-bold">Bizi Tanıyın</h2>
        <p className="text-3xl text-center">
          Pehlivan Team , geleceğin mühendislerinden oluşan , ileri
          teknolojileri kullanarak alternatif enerjili araçlar üreten Trakya
          Üniversitesi Tasarım ve Proje Topluluğu altında bir üniversite
          ekibidir.2014 yılında kurulan ekibimiz elde ettiği başarılarla
          kazandığı tecrübeyi katlayarak heyecanlı bir şekilde yoluna devam
          etmektedir.Takımımız bugüne kadar ürettiği araçlarla ve katıldığı
          yarışlarda elde ettiği başarılarla her kesimden insanın takdirini
          kazanmıştır.
        </p>
      </div>

      <article className="flex flex-col items-center justify-center w-full bg-black text-white p-16 gap-16">
        <h2 className="text-4xl font-bold">Araçlarımız</h2>
        <p className="text-3xl text-center">
          Pehlivan Team olarak 2014 yılından bu yana birçok araç ürettik ve
          yarışmalara katıldık. Bu araçlarımızdan bazıları aşağıda
          gösterilmektedir.
        </p>
        <br />
        <br />
        <br />
        <Reveal width="fit-content" left={true}>
          <Card className=" flex flex-row bg-black text-white border-none justify-between items-center gap-5 px-64">
            <Image
              src="/img/sari.jpeg"
              alt="araclar"
              width={400}
              height={400}
            />
            <div>
              <h1 className="text-6xl font-bol">Sarı</h1>
              <p className="text-4xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                quas sequi similique assumenda nam, exercitationem dicta.
                Quidem, temporibus ut suscipit modi nulla aperiam! Quos nihil
                nostrum accusamus dignissimos possimus repellendus.
              </p>
            </div>
          </Card>
        </Reveal>
        <Reveal width="fit-content">
          <Card className=" flex flex-row bg-black text-white border-none justify-center items-center gap-5 px-64">
            <div>
              <h1 className="text-6xl font-bol">Sarı</h1>
              <p className="text-4xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                quas sequi similique assumenda nam, exercitationem dicta.
                Quidem, temporibus ut suscipit modi nulla aperiam! Quos nihil
                nostrum accusamus dignissimos possimus repellendus.
              </p>
            </div>
            <Image
              src="/img/sari.jpeg"
              alt="araclar"
              width={400}
              height={400}
            />
          </Card>
        </Reveal>
        <Reveal width="fit-content" left={true}>
          <Card className=" flex flex-row bg-black text-white border-none justify-between items-center gap-5 px-64">
            <Image
              src="/img/sari.jpeg"
              alt="araclar"
              width={400}
              height={400}
            />
            <div>
              <h1 className="text-6xl font-bol">Sarı</h1>
              <p className="text-4xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                quas sequi similique assumenda nam, exercitationem dicta.
                Quidem, temporibus ut suscipit modi nulla aperiam! Quos nihil
                nostrum accusamus dignissimos possimus repellendus.
              </p>
            </div>
          </Card>
        </Reveal>
      </article>
    </main>
  );
}
