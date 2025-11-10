"use client"
import Link from 'next/link'
import * as React from 'react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type PostItem = { id: string; content: string; imageUrl?: string; likeCount: number; commentCount: number }
interface ProfileTabsProps {
  posts: PostItem[]
  blogs: { slug: string; title: string }[]
  username: string
  name: string
}

export default function ProfileTabs({ posts, blogs, username, name }: ProfileTabsProps) {
  const [tab, setTab] = React.useState<'posts' | 'blogs' | 'about'>('posts')
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
      <TabsList className="bg-slate-800/60 text-slate-300 border border-slate-700">
        <TabsTrigger value="posts">Gönderiler</TabsTrigger>
        <TabsTrigger value="blogs">Blog</TabsTrigger>
        <TabsTrigger value="about">Hakkında</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        {posts.length === 0 ? (
          <p className="text-slate-300">Henüz gönderi yok.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((p) => (
              <li key={p.id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-slate-100 whitespace-pre-wrap">{p.content}</p>
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt="post image"
                    className="mt-3 max-h-72 w-full object-cover rounded-lg"
                  />
                ) : null}
                <div className="text-sm text-slate-400 mt-2">
                  <span>{p.likeCount || 0} beğeni</span>
                  <span className="mx-2">•</span>
                  <span>{p.commentCount || 0} yorum</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right">
          <Link
            className="text-sm text-emerald-300 hover:underline"
            href={`/profile/${username}/posts`}
          >
            Tüm gönderiler
          </Link>
        </div>
      </TabsContent>

      <TabsContent value="blogs" className="mt-6">
        {blogs.length === 0 ? (
          <p className="text-slate-300">Henüz blog yazısı yok.</p>
        ) : (
          <ul className="space-y-3">
            {blogs.map((b) => (
              <li key={b.slug} className="flex items-start justify-between">
                <Link href={`/blog/${b.slug}`} className="text-slate-100 hover:underline">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right">
          <Link className="text-sm text-emerald-300 hover:underline" href={`/blog`}>
            Blog'a git
          </Link>
        </div>
      </TabsContent>

      <TabsContent value="about" className="mt-6 text-slate-300">
        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h3 className="text-lg font-semibold text-white">{name} hakkında</h3>
          <p className="text-sm text-slate-400 mt-2">
            Bu bölüm yakın zamanda genişletilecek. Projeler, rozetler ve daha fazlası eklenecek.
          </p>
          <div className="mt-4 text-right">
            <Link
              className="text-sm text-emerald-300 hover:underline"
              href={`/profile/${username}`}
            >
              Profil ana sayfası
            </Link>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

