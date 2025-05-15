import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Sponsors from "@/constants/sponsors";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

function SponsorSlider() {
  return (
    <div className="w-[100vw] lg:h-[40vh] h-[40vh] flex flex-col items-center justify-center mx-auto  bg-black">
      <h2 className="text-3xl font-bold text-white justify-center">
        Sponsorlarımız
      </h2>
      <Carousel
        opts={{
          loop: true,
          duration: 800,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <div className="flex items-center justify-between w-full px-4 lg:px-8">
          <CarouselPrevious className="text-white hidden lg:flex" />

          <CarouselNext className="text-white hidden lg:flex" />
        </div>
        <CarouselContent className="">
          {Sponsors.map((sponsor) => (
            <CarouselItem
              key={sponsor.name}
              className=" flex justify-center  md:basis-1/3  ml-0 w-[30vw] lg:w-full"
            >
              <Link href={sponsor.url} target="_blank">
                <div className="w-[200px] h-[35vh] lg:w-[300px] lg:h-[300px] flex items-center justify-center flex-col">
                  <img
                    src={sponsor.logo}
                    alt=""
                    className="w-full h-full object-contain "
                  />

                  <h3 className="text-lg font-semibold  text-gray-300 text-center">
                    {sponsor.name}
                  </h3>
                  <p className="text-sm text-gray-300">{sponsor.description}</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default SponsorSlider;
