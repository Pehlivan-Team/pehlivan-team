'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import Sponsors from '@/constants/sponsors'

function SponsorSlider() {
  return (
    <section className="bg-gray-950 w-full py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-12">
          Değerli Sponsorlarımız
        </h2>

        <div className="relative w-full overflow-hidden group">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...Sponsors, ...Sponsors].map((sponsor, index) => (
              <Link
                href={sponsor.url}
                key={`${sponsor.name}-${index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-16 flex-shrink-0"
                aria-label={sponsor.name}
              >
                <div className="relative w-80 h-40 bg-white rounded-lg shadow-md p-2 flex items-center justify-center transition-transform duration-300 transform hover:scale-110">
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="p-3"
                    height={150}
                    width={300}
                    sizes="100vw"
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SponsorSlider
