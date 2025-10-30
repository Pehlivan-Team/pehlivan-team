import { firestoreAdmin } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Post } from "@/types/blog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import he from "he";
import { Metadata } from "next";

export const revalidate = 60; // 60 saniyede bir ISR

// Sunucu tarafında DOMPurify'ı doğru şekilde yapılandırıyoruz
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as any);

async function getPostBySlug(slug: string): Promise<Post | null> {
  const snapshot = await firestoreAdmin
    .collection("posts")
    .where("slug", "==", slug)
    .where("isPublished", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  } as Post;
}

async function getPublishedPosts(): Promise<Post[]> {
  const snapshot = await firestoreAdmin
    .collection("posts")
    .where("isPublished", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  if (snapshot.empty) return [];
  return snapshot.docs.map((doc) => doc.data() as Post);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Yazı Bulunamadı",
      description: "Aradığınız blog yazısı mevcut değil.",
    };
  }

  // İçerikten ilk 155 karakteri alıp meta description olarak kullanıyoruz
  // HTML etiketlerini temizliyoruz
  const excerpt =
    post.content.substring(0, 155).replace(/<[^>]*>?/gm, "") + "...";

  return {
    title: `${post.title} | Pehlivan Team Blog`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://www.pehli1team.com/blog/${post.slug}`,
      siteName: "Pehlivan Team",
      images: [
        {
          url:
            post.imageUrl || "https://www.pehli1team.com/default-og-image.png", // Varsayılan bir resim belirleyin
          width: 1200,
          height: 630,
        },
      ],
      locale: "tr_TR",
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.imageUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: [
      {
        "@type": "Person",
        name: post.author,
      },
    ],
  };

  // Editörden gelen HTML içeriğini güvenlik için temizliyoruz
  //he.decode ile HTML entity'lerini decode ediyoruz yoksa &lt; olarak render ediliyor o da < olarak gözüküyor.
  //DOMPurify ile de XSS saldırılarına karşı temizliyoruz
  const sanitizedContent = DOMPurify.sanitize(he.decode(post.content));

  return (
    <div className="bg-background min-h-screen text-foreground pt-24">
      <main className="container mx-auto py-12 px-4">
        <article className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-6 text-lg text-muted-foreground">
              <Image
                src={post.authorImage || "/default-avatar.png"}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <span>{post.author}</span>
              <span>•</span>
              <span>
                {format(new Date(post.createdAt), "dd MMMM yyyy", {
                  locale: tr,
                })}
              </span>
            </div>
          </header>

          {post.imageUrl && (
            <div className="relative aspect-auto w-max rounded-lg overflow-hidden mb-12">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={450}
                sizes="100vw"
              />
            </div>
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-h2:text-red-500 prose-a:text-red-500 hover:prose-a:text-red-600"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
