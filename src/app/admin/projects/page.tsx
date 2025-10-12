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
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proje Yönetimi</h1>
      <ProjectsClientPage initialProjects={projects} />
    </div>
  );
}
