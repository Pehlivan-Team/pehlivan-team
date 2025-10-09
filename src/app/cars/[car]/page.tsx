"use client";

import React from "react";
import { cars } from "@/constants";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { User, Calendar, Trophy } from "lucide-react";

function CarDetailPage({ params }: { params: { car: string } }) {
  const carIndex = Number(params.car);

  // Handle cases where the car ID is invalid
  if (isNaN(carIndex) || carIndex < 0 || carIndex >= cars.length) {
    notFound();
  }
  const selectedCar = cars[carIndex];

  return (
    <div className="bg-gray-950 text-white min-h-screen pt-24 lg:pt-32 pb-16">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Car Info */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-red-500">{selectedCar.name}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg border-y border-gray-700 py-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-gray-400" />
                <span>{selectedCar.year}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-gray-400" />
                <span>Kaptan: <b>{selectedCar.teamLeader}</b></span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">{selectedCar.carDesc}</p>

            {selectedCar.awards?.length > 0 && (
              <div className="pt-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Trophy className="h-7 w-7 text-yellow-400" />
                  Kazanılan Ödüller
                </h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  {selectedCar.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Image Carousel */}
          <div className="sticky top-24">
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {selectedCar.photos.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-slate-700">
                      <Image
                        src={photo}
                        alt={`${selectedCar.name} - Resim ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-black/50 text-white hover:bg-black/80 border-slate-600" />
              <CarouselNext className="right-2 bg-black/50 text-white hover:bg-black/80 border-slate-600" />
            </Carousel>
          </div>
          </div>
      </motion.div>
    </div>
  );
}

export default CarDetailPage;