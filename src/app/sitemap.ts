import { MetadataRoute } from "next";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { cars } from "@/constants/cars";
import { teamsData } from "@/constants/teams";
import { Post } from "@/types/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pehli1team.com"; // Sitenizin ana URL'ini buraya yazın

  // 1. Statik sayfaları listeye ekle
  const staticRoutes = [
    "/",
    "/teams",
    "/timeline",
    "/add_member",
    "/shorten",
    "/liste",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // 2. Dinamik blog yazılarını Firestore'dan çek ve listeye ekle
  const postsSnapshot = await firestoreAdmin
    .collection("posts")
    .where("isPublished", "==", true)
    .get();

  const blogPostRoutes = postsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${baseUrl}/blog/${data.slug}`,
      lastModified: data.updatedAt.toDate().toISOString(),
    };
  });

  // 3. Dinamik araç sayfalarını listeye ekle
  const carRoutes = cars.map((car, index) => ({
    url: `${baseUrl}/cars/${index}`,
    lastModified: new Date().toISOString(),
  }));

  // 4. Dinamik takım sayfalarını listeye ekle
  const teamRoutes = teamsData.map((team) => ({
    url: `${baseUrl}/teams/${team.slug}`,
    lastModified: new Date().toISOString(),
  }));

  // Tüm URL'leri birleştir ve geri döndür
  return [...staticRoutes, ...blogPostRoutes, ...carRoutes, ...teamRoutes];
}
