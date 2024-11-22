import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { cars } from "@/constants";
import Link from "next/link";
function MainPageCars() {
  return (
    <section
      id="cars"
      className="bg-red-950 w-full py-12 md:py-24 lg:py-32 justify-center flex"
    >
      <div className="pl-2 pr-2 px-4 md:px-6">
        <h2 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          Araçlarımız
        </h2>
        <div className="flex flex-col md:flex-row gap-2 sm:mx-[25vw] ">
          {cars.map((car, index) => (
            <Link href={"/cars/" + index} key={index}>
              <Card
                className="bg-slate-900 bg-opacity-60 flex flex-wrap justify-center md:w-[25vw] w-screen rounded-2xl hover:shadow-lg "
                key={index}
              >
                <CardContent className="p-6">
                  <CardHeader>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {car.name}
                    </h3>
                    <h3 className="text-white">{car.year}</h3>
                  </CardHeader>
                  <Image
                    className="rounded-lg w-max"
                    src={car.photos[0]}
                    alt={car.name + " photo"}
                    width={200}
                    height={200}
                  />
                  <p className="text-gray-200">{car.awards.toString()}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainPageCars;
