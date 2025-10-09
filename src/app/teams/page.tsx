import Link from "next/link";
import { teamsData } from "@/constants/teams";

export default function TeamsPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <header className="pt-32 pb-16 bg-[#101b40]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
            Takımlarımız
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            Farklı disiplinlerde uzmanlaşmış ekiplerimizle tanışın. Her takım,
            yenilikçi projelerle geleceğin teknolojisini şekillendiriyor.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamsData.map((team) => (
            <Link href={`/teams/${team.slug}`} key={team.slug}>
              <div className="bg-slate-800 rounded-lg h-full flex flex-col group border border-slate-700 hover:border-red-500 hover:-translate-y-2 transition-all duration-300">
                <div className="p-6 flex-grow flex flex-col text-center items-center">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4 border-2 border-red-500">
                    <team.Icon className="w-8 h-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold group-hover:text-red-400 transition-colors">
                    {team.name}
                  </h2>
                  <p className="mt-4 text-gray-300 flex-grow">
                    {team.description.substring(0, 120)}...
                  </p>
                  <span className="mt-4 font-semibold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Detayları Gör →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
