import { redirect, notFound } from "next/navigation";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Firebase konfigürasyonumuzu import ediyoruz

async function getUrlFromSlug(slug: string): Promise<string | null> {
  try {
    // Firestore'da "links" koleksiyonunu hedefliyoruz
    const linksCollectionRef = collection(db, "links");

    // 'slug' alanı, gelen URL parametresiyle eşleşen dokümanı aramak için bir sorgu oluşturuyoruz
    const q = query(linksCollectionRef, where("slug", "==", slug), limit(1));

    // Sorguyu çalıştırıyoruz
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Eğer hiçbir doküman bulunamazsa, null döndür
      console.log(`Slug bulunamadı: ${slug}`);
      return null;
    }

    // Bulunan ilk dokümanın 'longUrl' alanını al ve döndür
    const docData = querySnapshot.docs[0].data() as { longUrl: string };
    return docData.longUrl;
  } catch (error) {
    console.error("Firestore read error:", error);
    return null;
  }
}

export default async function ShortLinkRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  const longUrl = await getUrlFromSlug(params.slug);

  if (!longUrl) {
    return notFound();
  }

  redirect(longUrl);
}
