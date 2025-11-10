import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { firestoreAdmin } from '@/lib/firebase-admin'

async function fetchProjects() {
  const snapshot = await firestoreAdmin.collection('projects').get()
  return snapshot.docs.map((doc) => doc.data())
}
export default async function ProjectsPage() {
  const projectsData = await fetchProjects()

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <header className="pt-32 pb-16 bg-[#13439c]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">Projelerimiz</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            Yıllar boyunca geliştirdiğimiz, her biri yenilik ve mühendislik tutkumuzun birer kanıtı
            olan projelerimizi keşfedin.
          </p>
        </div>
      </header>
      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.slug} className="group">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-slate-800 hover:border-red-500 transition-all duration-300">
                <Image
                  src={project.image}
                  alt={`${project.name} photo`}
                  fill
                  className="z-0 transition-transform duration-300 group-hover:scale-110 object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                <div className="relative z-20 flex flex-col justify-end h-full p-6">
                  <h3 className="text-2xl font-bold">{project.name}</h3>
                  <p className="text-lg text-gray-300">{project.year}</p>
                  <div className="flex items-center mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Detayları Gör</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
