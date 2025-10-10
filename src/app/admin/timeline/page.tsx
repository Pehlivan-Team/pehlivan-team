import { firestoreAdmin } from "@/lib/firebase-admin";
import { TimelineClientPage } from "./_components/TimelineClientPage";

export interface TimelineEvent {
  id: string; // Firestore document ID
  order: number;
  year: string;
  title: string;
  description: string;
  image: string;
  awards: string[];
}

async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const snapshot = await firestoreAdmin
    .collection("timeline")
    .orderBy("order", "asc")
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      order: data.order,
      year: data.year,
      title: data.title,
      description: data.description,
      image: data.image,
      awards: data.awards || [],
    };
  });
}

export default async function AdminTimelinePage() {
  const events = await getTimelineEvents();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tarihçe Yönetimi</h1>
      <TimelineClientPage initialEvents={events} />
    </div>
  );
}