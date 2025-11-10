'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type SearchUser = {
  id: string
  username: string
  name: string
  profilePictureUrl: string
  team?: string
}

type SearchPost = {
  id: string
  authorUsername: string
  content: string
  imageUrl?: string | null
  likeCount: number
  commentCount: number
}

export default function SearchPage() {
  const [q, setQ] = React.useState('')
  const [tab, setTab] = React.useState<'all' | 'users' | 'posts'>('all')
  const [loading, setLoading] = React.useState(false)
  const [users, setUsers] = React.useState<SearchUser[]>([])
  const [posts, setPosts] = React.useState<SearchPost[]>([])
  const [err, setErr] = React.useState<string | null>(null)

  // Keyboard shortcuts: '/' focuses input, ESC clears
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          setQ('')
          inputRef.current?.blur()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  React.useEffect(() => {
    if (!q.trim()) {
      setUsers([])
      setPosts([])
      setErr(null)
      return
    }

    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      setLoading(true)
      setErr(null)
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&types=users,posts&limit=10`,
          {
            signal: ctrl.signal,
          }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setUsers(data.users || [])
        setPosts(data.posts || [])
      } catch (e: any) {
        if (e.name !== 'AbortError') setErr(e.message)
      } finally {
        setLoading(false)
      }
    }, 300) // debounce

    return () => {
      ctrl.abort()
      clearTimeout(t)
    }
  }, [q])

  const showUsers = tab === 'users'
  const showPosts = tab === 'posts'
  // For 'all' we combine into a single array for a unified card grid
  const combined = React.useMemo(() => {
    if (tab !== 'all') return [] as Array<{ kind: 'user' | 'post'; item: any }>
    const u = users.map((item) => ({ kind: 'user' as const, item }))
    const p = posts.map((item) => ({ kind: 'post' as const, item }))
    return [...u, ...p]
  }, [tab, users, posts])

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">Ara</h1>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kullanıcı, gönderi... ( / ile odaklan )"
            className="bg-slate-900/70 text-white border-slate-700 pr-28"
          />
          {q && !loading && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-1/2 -translate-y-1/2 right-2 text-xs text-slate-300 hover:text-white"
              onClick={() => setQ('')}
            >
              Temizle
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-slate-800">/</kbd> odak</span>
          <span className="inline-flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-slate-800">Esc</kbd> temizle</span>
          {q && (
            <span className="inline-flex items-center gap-1">
              <Badge variant="outline" className="border-emerald-600/50 text-emerald-300">{users.length} kullanıcı</Badge>
              <Badge variant="outline" className="border-teal-600/50 text-teal-300">{posts.length} gönderi</Badge>
            </span>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="text-white">
        <TabsList className="bg-slate-800 text-white">
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="posts">Gönderiler</TabsTrigger>
        </TabsList>

        {loading && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-slate-800/40" />
            ))}
          </div>
        )}
        {err && (
          <div className="mt-6 p-4 border border-red-600/40 bg-red-950/40 rounded-md">
            <p className="text-red-300 font-medium">Hata: {err}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-red-600/40 text-red-300 hover:bg-red-900/40"
              onClick={() => setQ(q)}
            >
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* Users tab */}
        {showUsers && (
          <TabsContent value="users" className="mt-6">
            {users.length === 0 && !loading ? (
              <p className="text-slate-300">Kullanıcı bulunamadı.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((u) => (
                  <Link key={u.id} href={`/profile/${u.username}`} className="group">
                    <Card className="h-full bg-slate-900/70 border-slate-700 hover:border-emerald-600/40 transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Image
                          src={u.profilePictureUrl || '/avatar.png'}
                          alt={u.name}
                          width={48}
                          height={48}
                          className="rounded-full ring-1 ring-slate-700 group-hover:ring-emerald-600/60"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{u.name}</div>
                          <div className="text-xs text-emerald-300 font-mono">@{u.username}</div>
                          {u.team && (
                            <Badge className="mt-1 bg-red-600/80 hover:bg-red-600 text-white text-[10px] py-0.5 px-1.5">
                              {u.team}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* Posts tab */}
        {showPosts && (
          <TabsContent value="posts" className="mt-6">
            {posts.length === 0 && !loading ? (
              <p className="text-slate-300">Gönderi bulunamadı.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <Link key={p.id} href={`/posts/${p.id}`} className="group">
                    <Card className="h-full bg-slate-900/70 border-slate-700 group-hover:border-teal-600/40 transition-colors">
                      <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs text-emerald-300 font-mono">@{p.authorUsername}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>❤️ {p.likeCount}</span>
                          <span>💬 {p.commentCount}</span>
                        </div>
                      </div>
                      <div className="text-sm text-white line-clamp-5 whitespace-pre-wrap">{p.content}</div>
                      {p.imageUrl && (
                        <div className="overflow-hidden rounded-md border border-slate-700">
                          <Image
                            src={p.imageUrl}
                            alt="post"
                            width={600}
                            height={400}
                            className="rounded-md object-cover h-40 w-full"
                          />
                        </div>
                      )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* Combined "all" */}
        {tab === 'all' && !loading && !err && (
          <div className="mt-6">
            {combined.length === 0 ? (
              <p className="text-slate-300">Sonuç bulunamadı.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {combined.map((row) => {
                  if (row.kind === 'user') {
                    const u = row.item as SearchUser
                    return (
                      <Link key={`u-${u.id}`} href={`/profile/${u.username}`} className="group">
                        <Card className="h-full bg-slate-900/70 border-slate-700 hover:border-emerald-600/40 transition-colors">
                          <CardContent className="p-4 flex items-center gap-4">
                            <Image
                              src={u.profilePictureUrl || '/avatar.png'}
                              alt={u.name}
                              width={48}
                              height={48}
                              className="rounded-full ring-1 ring-slate-700 group-hover:ring-emerald-600/60"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate">{u.name}</div>
                              <div className="text-xs text-emerald-300 font-mono">@{u.username}</div>
                              {u.team && (
                                <Badge className="mt-1 bg-red-600/80 hover:bg-red-600 text-white text-[10px] py-0.5 px-1.5">
                                  {u.team}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  } else {
                    const p = row.item as SearchPost
                    return (
                      <Link key={`p-${p.id}`} href={`/posts/${p.id}`} className="group">
                        <Card className="h-full bg-slate-900/70 border-slate-700 group-hover:border-teal-600/40 transition-colors">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-xs text-emerald-300 font-mono">@{p.authorUsername}</div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>❤️ {p.likeCount}</span>
                                <span>💬 {p.commentCount}</span>
                              </div>
                            </div>
                            <div className="text-sm text-white line-clamp-5 whitespace-pre-wrap">{p.content}</div>
                            {p.imageUrl && (
                              <div className="overflow-hidden rounded-md border border-slate-700">
                                <Image
                                  src={p.imageUrl}
                                  alt="post"
                                  width={600}
                                  height={400}
                                  className="rounded-md object-cover h-40 w-full"
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  }
                })}
              </div>
            )}
          </div>
        )}
      </Tabs>
    </>
  )
}
