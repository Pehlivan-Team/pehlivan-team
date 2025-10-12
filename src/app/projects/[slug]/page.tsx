import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { User, Calendar, Trophy } from "lucide-react";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { Project } from "@/types/projects";

async function getProject(slug: string): Promise<Project | null> {
  const snapshot = await firestoreAdmin
    .collection("projects")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project: Project | null = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="font-semibold text-red-400">{project.category}</p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
              {project.name}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg border-y border-gray-700 py-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-gray-400" />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-gray-400" />
                <span>
                  Kaptan: <b>{project.leader}</b>
                </span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              {project.description}
            </p>
            {project.awards && project.awards.length > 0 && (
              <div className="pt-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Trophy className="h-7 w-7 text-yellow-400" /> Kazanılan
                  Ödüller
                </h3>
                <ul className="space-y-2 list-disc list-inside text-gray-300">
                  {project.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="sticky top-24">
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {(project.images || [project.image]).map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-slate-700">
                      <Image
                        src={photo}
                        alt={`${project.name} - Resim ${index + 1}`}
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
      </div>
    </div>
  );
}

// SEO için statik sayfalar oluştur
export async function generateStaticParams() {
  const snapshot = await firestoreAdmin.collection("projects").get();
  return snapshot.docs.map((doc) => ({ slug: doc.data().slug }));
}
