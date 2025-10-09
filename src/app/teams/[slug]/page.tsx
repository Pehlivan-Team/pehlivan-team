import { notFound } from "next/navigation";
import Image from "next/image";
import { teamsData } from "@/constants/teams";
import { CheckCircle } from "lucide-react";

// Function to find the correct team data based on the URL slug
const getTeam = (slug: string) => {
  return teamsData.find((team) => team.slug === slug);
};

export default function TeamDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const team = getTeam(params.slug);

  if (!team) {
    notFound();
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white pt-24">
      <main className="container mx-auto py-12 px-4">
        <article className="max-w-5xl mx-auto">
          <header className="text-center mb-12">
            <div className="inline-block bg-red-600/20 p-4 rounded-full border-2 border-red-500 mb-4">
              <team.Icon className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {team.name}
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Takım Lideri: {team.leader}
            </p>
          </header>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 shadow-lg">
            <Image
              src={team.image}
              alt={team.name}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-red-400">
                Takım Hakkında
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {team.description}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-red-400">
                Sorumluluk Alanları
              </h2>
              <ul className="space-y-3">
                {team.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

// Optional: Generate static pages for each team for better performance
export async function generateStaticParams() {
  return teamsData.map((team) => ({
    slug: team.slug,
  }));
}
