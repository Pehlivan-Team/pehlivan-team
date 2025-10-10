import React from "react";
import Image from "next/image";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { TimelineClientPage } from "./_components/TimelineClientPage"; // İstemci bileşenini import et

// --- Veri Tipi Tanımı ---
export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image: string; // Artık bu bir URL yolu olacak
  awards: string[];
}

// --- Sunucu Tarafında Veri Çekme ---
async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const snapshot = await firestoreAdmin.collection("timeline").orderBy("order", "asc").get();
  
  if (snapshot.empty) {
    return [];
  }
  
  // Doküman verilerini TimelineEvent tipine dönüştür
  return snapshot.docs.map(doc => doc.data() as TimelineEvent);
}

// --- Ana Sayfa Bileşeni (Sunucu) ---
export default async function TimelinePage() {
  const events = await getTimelineEvents();

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <header className="pt-32 pb-16 bg-[#101b40]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">Takım Tarihçemiz</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            2014'ten bugüne uzanan yolculuğumuzda elde ettiğimiz başarıları ve geliştirdiğimiz araçları keşfedin.
          </p>
        </div>
      </header>

      {/* Veriyi istemci bileşenine prop olarak aktar */}
      <TimelineClientPage events={events} />
    </div>
  );
}