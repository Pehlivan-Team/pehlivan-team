"use client"
import Link from 'next/link'
import { useEffect, useState, forwardRef } from 'react'
import { MessageCircle } from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface QuickStatsProps {
  username: string
  initialPostCount?: number
  className?: string
}

export default function QuickStats({ username, initialPostCount = 0, className }: QuickStatsProps) {
  const [loading, setLoading] = useState(true)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          setLoading(true)
          setError(null)
          const res = await fetch(`/api/follow/${encodeURIComponent(username)}`)
          if (res.ok) {
            const data = await res.json()
            if (active) {
              setFollowers(data.followersCount || 0)
              setFollowing(data.followingCount || 0)
            }
          }
        } catch (e: any) {
          if (active) setError(e.message)
        } finally {
          if (active) setLoading(false)
        }
      })()
    return () => { active = false }
  }, [username])

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full bg-slate-800/40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-3">
        <PostsDialog username={username} initialCount={initialPostCount}>
          <StatCard label="Gönderi" value={initialPostCount} />
        </PostsDialog>
        <MessagesCard username={username} />
        <FollowDialog username={username} type="followers" count={followers}>
          <StatCard label="Takipçi" value={followers} interactive />
        </FollowDialog>
        <FollowDialog username={username} type="following" count={following}>
          <StatCard label="Takip" value={following} interactive />
        </FollowDialog>
      </div>
      {error && <p className="text-[10px] text-red-400 mt-2">Hata: {error}</p>}
    </div>
  )
}

const StatCard = forwardRef<
  HTMLButtonElement | HTMLDivElement,
  { label: string; value: number; interactive?: boolean }
>(function StatCard({ label, value, interactive }, ref) {
  if (interactive) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-label={`${label} detaylarını aç`}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-xl group"
      >
        <Card className="bg-slate-900/70 border-slate-700 transition-colors cursor-pointer hover:border-emerald-600/50">
          <CardContent className="p-3 text-center">
            <div className="text-xs uppercase tracking-wide text-slate-400 group-hover:text-slate-300">
              {label}
            </div>
            <div className="mt-1 text-lg font-semibold text-white group-hover:scale-[1.04] transition-transform">
              {value}
            </div>
          </CardContent>
        </Card>
      </button>
    )
  }
  return (
    <Card
      ref={ref as React.Ref<HTMLDivElement>}
      className="bg-slate-900/70 border-slate-700 transition-colors"
    >
      <CardContent className="p-3 text-center">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </div>
        <div className="mt-1 text-lg font-semibold text-white">
          {value}
        </div>
      </CardContent>
    </Card>
  )
})
StatCard.displayName = 'StatCard'

interface FollowDialogProps {
  username: string
  type: 'followers' | 'following'
  count: number
  children: React.ReactNode
}

function FollowDialog({ username, type, count, children }: FollowDialogProps) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (loading || list) return
    setLoading(true)
    setError(null)
    try {
      const endpoint = `/api/follow/${encodeURIComponent(username)}/${type}`
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('Liste alınamadı')
      const data = await res.json()
      setList(Array.isArray(data.users) ? data.users : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleOpen(next: boolean) {
    setOpen(next)
    if (next) load()
  }

  return (
    <>
      <div onClick={() => handleOpen(true)} className="contents">
        {children}
      </div>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="bg-slate-950 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>
              {type === 'followers' ? 'Takipçiler' : 'Takip Edilenler'} ({count})
            </DialogTitle>
            <DialogDescription>
              {type === 'followers'
                ? 'Bu kullanıcıyı takip edenler.'
                : 'Bu kullanıcının takip ettikleri.'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2 mt-2">
            {loading && <p className="text-xs text-slate-400">Yükleniyor…</p>}
            {error && <p className="text-xs text-red-400">{error}</p>}
            {!loading && !error && list && !list.length && (
              <p className="text-xs text-slate-500">Liste boş.</p>
            )}
            {list?.map((u) => {
              const avatarUrl = u.imageUrl || u.photoURL || u.avatar || u.picture || null
              const usernameSafe = u.username || u.id || 'anon'
              const RowInner = (
                <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm hover:border-emerald-700/50 transition-colors">
                  <Avatar className="h-8 w-8 border border-slate-700">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={usernameSafe} />}
                    <AvatarFallback className="text-xs">
                      {usernameSafe[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-slate-200">@{usernameSafe}</span>
                      {u.name && (
                        <span className="truncate text-xs text-slate-400">{u.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
              return usernameSafe && usernameSafe !== 'anon' ? (
                <Link
                  key={usernameSafe}
                  href={`/profile/${usernameSafe}`}
                  className="block"
                >
                  {RowInner}
                </Link>
              ) : (
                <div key={usernameSafe}>{RowInner}</div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function MessagesCard({ username }: { username: string }) {
  return (
    <Link href="/messages" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-xl group">
      <Card className="bg-slate-900/70 border-slate-700 transition-colors cursor-pointer hover:border-emerald-600/50">
        <CardContent className="p-3 text-center">
          <div className="text-xs uppercase tracking-wide text-slate-400 group-hover:text-slate-300 flex items-center justify-center gap-1">
            <MessageCircle className="h-3 w-3" />
            Mesaj
          </div>
          <div className="mt-1 text-lg font-semibold text-white group-hover:scale-[1.04] transition-transform">
            💬
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

interface PostsDialogProps {
  username: string
  initialCount: number
  children: React.ReactNode
}

function PostsDialog({ username, initialCount, children }: PostsDialogProps) {
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (loading || posts) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/posts?username=${encodeURIComponent(username)}&limit=25`)
      if (!res.ok) throw new Error('Gönderiler alınamadı')
      const data = await res.json()
      setPosts(Array.isArray(data.posts) ? data.posts : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <div className="contents">
        {children}
      </div>

    </>
  )
}
