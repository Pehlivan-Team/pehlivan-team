import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import createDOMPurify from 'dompurify'
import he from 'he'
import { JSDOM } from 'jsdom'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { firestoreAdmin } from '@/lib/firebase-admin'
import { Post } from '@/types/blog'
import AuthorHeader from '@/components/blog/AuthorHeader'
import HeaderImage from '@/components/blog/HeaderImage'

export const revalidate = 60 // 60 saniyede bir ISR

// Sunucu tarafında DOMPurify'ı doğru şekilde yapılandırıyoruz
const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window as any)

async function getPostBySlug(slug: string): Promise<Post | null> {
  const snapshot = await firestoreAdmin
    .collection('blogs')
    .where('slug', '==', slug)
    .where('isPublished', '==', true)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  } as Post
}

async function getPublishedPosts(): Promise<Post[]> {
  const snapshot = await firestoreAdmin
    .collection('blogs')
    .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .get()
  if (snapshot.empty) return []
  return snapshot.docs.map((doc) => doc.data() as Post)
}

async function getMoreByAuthor(author: string, excludeSlug: string, limit = 5): Promise<Post[]> {
  const snapshot = await firestoreAdmin
    .collection('blogs')
    .where('author', '==', author)
    .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit + 1)
    .get()
  if (snapshot.empty) return []
  return snapshot.docs
    .map((doc) => doc.data() as Post)
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit)
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
      description: 'Aradığınız blog yazısı mevcut değil.',
    }
  }

  // İçerikten ilk 155 karakteri alıp meta description olarak kullanıyoruz
  // HTML etiketlerini temizliyoruz
  const excerpt = post.content.substring(0, 155).replace(/<[^>]*>?/gm, '') + '...'

  return {
    title: `${post.title} | Pehlivan Team Blog`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://www.pehli1team.com/blog/${post.slug}`,
      siteName: 'Pehlivan Team',
      images: [
        {
          url: post.imageUrl || 'https://www.pehli1team.com/default-og-image.png', // Varsayılan bir resim belirleyin
          width: 1200,
          height: 630,
        },
      ],
      locale: 'tr_TR',
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: { params: any }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    notFound()
  }
  const moreByAuthor = await getMoreByAuthor(post.author || '', post.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.imageUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: [
      {
        '@type': 'Person',
        name: post.author,
      },
    ],
  }

  // Editörden gelen HTML içeriğini güvenlik için temizliyoruz
  //he.decode ile HTML entity'lerini decode ediyoruz yoksa &lt; olarak render ediliyor o da < olarak gözüküyor.
  //DOMPurify ile de XSS saldırılarına karşı temizliyoruz
  const sanitizedContent = DOMPurify.sanitize(he.decode(post.content))

  return (
    <div className="bg-background min-h-screen text-foreground pt-24">
      <main className="container mx-auto py-12 px-4">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl">
          <article className="lg:col-span-8">
            <AuthorHeader
              title={post.title}
              author={post.author}
              authorUsername={(post as any).authorUsername}
              authorImage={(post as any).authorImage}
              createdAt={format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: tr })}
            />

            {post.imageUrl && (
              <HeaderImage src={post.imageUrl} alt={post.title} />
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-h2:text-red-500 prose-a:text-red-500 hover:prose-a:text-red-600"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>

          <aside className="lg:col-span-4 lg:pl-4">
            <div className="sticky top-24">
            <div id="aside-image-slot" className="mt-4 hidden md:block" />
              <h2 className="text-xl font-semibold mb-4">
                {post.author} tarafından yazılan diğer blog postları
              </h2>
              {/* slot for header image when it shrinks */}
              {moreByAuthor.length === 0 ? (
                <p className="text-muted-foreground">No other posts yet.</p>
              ) : (
                <ul className="space-y-4">
                  {moreByAuthor.map((p) => (
                    <li key={p.slug} className="border rounded-md p-3">
                      <a href={`/blog/${p.slug}`} className="font-medium hover:underline">
                        {p.title}
                      </a>
                      <div className="text-sm text-muted-foreground mt-1">
                        {(() => {
                          const v: any = (p as any).createdAt
                          const d = v?.toDate ? v.toDate() : v ? new Date(v) : null
                          return d && !isNaN(d as any)
                            ? format(d as Date, 'dd MMM yyyy', { locale: tr })
                            : ''
                        })()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
