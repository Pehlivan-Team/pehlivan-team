import { firestoreAdmin } from "@/lib/firebase-admin";
import { ProjectsClientPage } from "./_components/ProjectsClientPage";
import { Project } from "@/types/projects";

async function getProjects(): Promise<Project[]> {
  const snapshot = await firestoreAdmin
    .collection("projects")
    .orderBy("order", "asc")
    .get();
  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  const parsedProjects = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    imageUrl: project.image ? project.image : null,
    order: project.order !== undefined ? project.order : null,
    category: project.category ? project.category : null,
    year: project.year ? project.year : null,
    leader: project.leader ? project.leader : null,
    specifications: project.specifications ? project.specifications : [],
    images: project.images ? project.images : [],
    awards: project.awards ? project.awards : [],
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proje Yönetimi</h1>
      <ProjectsClientPage initialProjects={parsedProjects} />
    </div>
  );
}
