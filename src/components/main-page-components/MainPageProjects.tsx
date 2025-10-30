"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/projects"; // Proje tipini import ediyoruz

// Bileşen artık 'projects' adında bir prop alıyor
export default function MainPageProjects({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <section
      id="projects"
      className="bg-[#020f29] w-full py-16 md:py-24 lg:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Projelerimiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Prop olarak gelen projeleri listeliyoruz */}
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-red-500 transition-all duration-300">
                  <Image
                    src={project.image}
                    alt={project.name + " photo"}
                    className="z-0 transition-transform duration-300 group-hover:scale-110"
                    priority
                    fill
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <div className="relative z-20 flex flex-col justify-end h-full p-6 text-white">
                    <h3 className="text-2xl font-bold">{project.name}</h3>
                    <p className="text-lg text-gray-300">{project.year}</p>
                    <div className="flex items-center mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Detayları Gör</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Tüm Projeleri Gör
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
