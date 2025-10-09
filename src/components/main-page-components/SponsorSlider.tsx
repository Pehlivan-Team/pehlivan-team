"use client";

import React from "react";
import Sponsors from "@/constants/sponsors";
import Link from "next/link";
import Image from "next/image";

function SponsorSlider() {
  return (
    <section className="bg-gray-950 w-full py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-12">
          Değerli Sponsorlarımız
        </h2>
        
        <div className="relative w-full overflow-hidden group">
          {/* Marquee Container */}
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {/* Render sponsors list twice for a seamless loop */}
            {[...Sponsors, ...Sponsors].map((sponsor, index) => (
              <Link
                href={sponsor.url}
                key={`${sponsor.name}-${index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-16 flex-shrink-0" // Increased margin for more space
                aria-label={sponsor.name}
              >
                {/* Each logo now has a white background for visibility and is larger */}
                <div className="relative w-80 h-40 bg-white rounded-lg shadow-md p-2 flex items-center justify-center transition-transform duration-300 transform hover:scale-110">
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className="p-3" // A little more padding for the larger size
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SponsorSlider;