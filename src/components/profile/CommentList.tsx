"use client"
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

interface CommentListProps {
  postId: string
}

interface SimpleComment {
  id: string
  username: string
  content: string
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<SimpleComment[]>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load(initial = false) {
    if (loading) return
    if (initial) setInitialLoading(true)
    setLoading(true)
    try {
      const url = new URL(`/api/posts/${postId}/comments`, window.location.origin)
      if (!initial && cursor) url.searchParams.set('cursor', cursor)
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Yorumlar alınamadı')
      const data = await res.json()
      setComments((prev) => (initial ? data.comments : [...prev, ...data.comments]))
      setCursor(data.nextCursor)
      setHasMore(Boolean(data.nextCursor))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  if (initialLoading) return <div className="mt-3 text-xs text-slate-500">Yorumlar yükleniyor…</div>
  if (error) return <div className="mt-3 text-xs text-red-400">{error}</div>
  if (!comments.length) return <div className="mt-3 text-xs text-slate-500">Henüz yorum yok.</div>

  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-md bg-slate-800/60 border border-slate-700 px-3 py-2 text-sm text-slate-200"
          >
            <span className="text-emerald-300 mr-2 font-mono">@{c.username}</span>
            <span className="whitespace-pre-wrap">{c.content}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="mt-2 flex justify-center">
          <Button size="sm" variant="ghost" onClick={() => load()} disabled={loading}>
            {loading ? 'Yükleniyor...' : 'Daha fazla'}
          </Button>
        </div>
      )}
    </div>
  )
}
