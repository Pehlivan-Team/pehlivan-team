import Link from "next/link";
import Image from "next/image";
import { firestoreAdmin } from "@/lib/firebase-admin";
import { Post } from "@/types/blog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// Sunucu tarafında yayınlanmış tüm yazıları çeken fonksiyon
 async function getPublishedPosts(): Promise<Post[]> {
  const snapshot = await firestoreAdmin
    .collection("posts")
    .where("isPublished", "==", true)
    .orderBy("createdAt", "desc")
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as Post;
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <header className="pt-32 pb-16 bg-[#101b40]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-300">
            Takımımızın en son haberleri, teknik makaleleri ve proje
            güncellemeleri.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
              <div className="bg-slate-800 rounded-lg overflow-hidden h-full flex flex-col border border-slate-700 hover:border-red-500 transition-colors">
                <div className="relative w-full h-48">
                  <Image
                    src={post.imageUrl || "/placeholder.jpg"} // Eğer kapak resmi yoksa bir varsayılan resim göster
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold group-hover:text-red-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-2">
                    {format(new Date(post.createdAt), "dd MMMM yyyy", {
                      locale: tr,
                    })}
                  </p>
                  <div className="flex-grow" />
                  <div className="flex items-center gap-2 mt-4">
                    <Image
                      src={post.authorImage || "/default-avatar.png"}
                      alt={post.author}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-300">{post.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-400">
              Henüz yayınlanmış bir yazı bulunmuyor.
            </h2>
            <p className="text-gray-500 mt-2">
              Lütfen daha sonra tekrar kontrol edin!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
