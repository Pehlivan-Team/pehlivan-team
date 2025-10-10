import { firestoreAdmin } from "@/lib/firebase-admin";
import { LinksClientPage } from "./_components/LinksClientPage";

// Veri tipini güncelledik
export interface ShortLink {
  id: string;
  slug: string;
  longUrl: string;
  createdAt: string;
}

const LINKS_PER_PAGE = 10; // Sayfa başına gösterilecek link sayısı

// Fonksiyonu, sayfa numarası alacak şekilde güncelledik
async function getPaginatedLinks(page = 1) {
  const linksCollection = firestoreAdmin.collection("links");

  // Toplam link sayısını alarak toplam sayfa sayısını hesaplıyoruz
  const countSnapshot = await linksCollection.count().get();
  const totalLinks = countSnapshot.data().count;
  const totalPages = Math.ceil(totalLinks / LINKS_PER_PAGE);

  // Belirli bir sayfadaki verileri çekmek için sorguyu güncelliyoruz
  const linksSnapshot = await linksCollection
    .orderBy("createdAt", "desc")
    .limit(LINKS_PER_PAGE)
    .offset((page - 1) * LINKS_PER_PAGE)
    .get();

  if (linksSnapshot.empty) {
    return { links: [], totalPages: 0, currentPage: 1 };
  }

  const links: ShortLink[] = linksSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      longUrl: data.longUrl,
      createdAt: data.createdAt.toDate().toISOString(),
    };
  });

  return { links, totalPages, currentPage: page };
}

// Ana sayfa bileşeni artık URL'den 'page' parametresini okuyor
export default async function AdminLinksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const { links, totalPages, currentPage } = await getPaginatedLinks(page);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kısaltılmış Linkleri Yönet</h1>
      <LinksClientPage
        initialLinks={links}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}