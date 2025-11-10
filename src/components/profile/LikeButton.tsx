"use client"
import { Heart, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

interface LikeButtonProps {
  postId: string
  initialCount?: number
}

export default function LikeButton({ postId, initialCount = 0 }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/likes`)
        if (!res.ok) return
        const data = await res.json()
        if (!active) return
        setCount(data.count ?? initialCount)
        setLiked(Boolean(data.liked))
      } catch {}
    })()
    return () => { active = false }
  }, [postId, initialCount])

  async function toggle() {
    if (loading) return
    setLoading(true)
    try {
      const method = liked ? 'DELETE' : 'POST'
      const res = await fetch(`/api/posts/${postId}/likes`, { method })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setLiked(Boolean(data.liked))
      setCount(data.count ?? count + (liked ? -1 : 1))
    } catch {} finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      disabled={loading}
      className={`gap-2 px-2 text-slate-300 hover:text-rose-300 ${liked ? 'text-rose-400' : ''}`}
      aria-pressed={liked}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 transition-transform ${liked ? 'fill-rose-500/20 text-rose-400 scale-110' : ''}`} />
      )}
      <span className="text-sm tabular-nums">{count}</span>
    </Button>
  )
}
