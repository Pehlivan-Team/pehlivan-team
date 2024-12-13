import React from "react";
import { cars } from "@/constants";
import Image from "next/image";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
function Car({ params }: { params: { car: string } }) {
  const selectedCar = cars[Number(params.car)];
  return (
    <div className="bg-[#1f1f1f] text-white flex flex-col gap-10 lg:p-10 py-16 min-h-[100vh]">
      <div className=" flex lg:flex-row flex-col gap-10 m-10 ">
        <div id="cardesc  " className="lg:w-[35vw]">
          <h1 className="text-4xl font-bold">{selectedCar.name}</h1>
          <div className="flex">TAKIM KAPTANI :<b>{selectedCar.teamLeader}</b></div>
          <h2>{selectedCar.year}</h2>
          <h3>{selectedCar.awards.toString()}</h3>
          <p>{selectedCar.carDesc}</p>
        </div>

        <Carousel
          className="w-[500px] rounded-lg"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {selectedCar.photos.map((photo, index) => (
              <Image
                key={index}
                src={photo}
                alt="car"
                width={1000}
                height={1000}
                className="mx-10"
              />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default Car;
