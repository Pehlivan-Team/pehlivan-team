import React from "react";
import { cars } from "@/constants";
import Image from "next/image";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
function Car({ params }: { params: { car: string } }) {
  const selectedCar = cars[Number(params.car)];
  return (
    <div className="bg-background flex flex-col gap-10 m-10">
      <div className="bg-background flex lg:flex-row flex-col gap-10 m-10 ">
        <div id="cardesc  " className="w-[35vw]">
          <h1 className="text-4xl font-bold">{selectedCar.name}</h1>
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

      <div>
        TAKIM KAPTANI :
        <h1 className="font-bold text-xl">{selectedCar.teamLeader}</h1>
      </div>
    </div>
  );
}

export default Car;
