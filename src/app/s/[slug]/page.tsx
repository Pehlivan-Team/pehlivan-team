import { redirect, notFound } from "next/navigation";
import { firestoreAdmin } from "@/lib/firebase-admin";
import admin from 'firebase-admin';

async function getUrlAndTrackClick(slug: string): Promise<string | null> {
  try {
    const linksCollectionRef = firestoreAdmin.collection("links");
    const q = linksCollectionRef.where("slug", "==", slug).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const longUrl = doc.data().longUrl;

    // Tıklamayı asenkron olarak artır, yönlendirmeyi bekletme
    doc.ref.update({
      clicks: admin.firestore.FieldValue.increment(1)
    }).catch(err => console.error("Click increment error:", err));
    
    return longUrl;

  } catch (error) {
    console.error("Redirect Error:", error);
    return null;
  }
}

export default async function ShortLinkRedirectPage({ params }: { params: { slug: string } }) {
  const longUrl = await getUrlAndTrackClick(params.slug);

  if (!longUrl) {
    return notFound();
  }

  redirect(longUrl);
}