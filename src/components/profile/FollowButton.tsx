"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

interface FollowButtonProps {
  targetUsername: string
  className?: string
}

export default function FollowButton({ targetUsername, className }: FollowButtonProps) {
  const { data: session } = useSession()
  const me = session?.user?.username
  const isSelf = me === targetUsername
  const [loading, setLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/follow/${encodeURIComponent(targetUsername)}`)
        if (res.ok) {
          const data = await res.json()
          if (active) setIsFollowing(!!data.isFollowing)
        }
      } catch (e: any) {
        if (active) setError(e.message)
      }
    })()
    return () => { active = false }
  }, [targetUsername])

  async function toggle() {
    if (!me || isSelf) return
    setLoading(true)
    setError(null)
    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/follow/${encodeURIComponent(targetUsername)}`, { method })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setIsFollowing(!!data.isFollowing)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (isSelf) return null

  return (
    <div className={className}>
      <Button size="sm" variant={isFollowing ? 'secondary' : 'default'} disabled={loading} onClick={toggle} className="gap-1">
        {loading ? '...' : isFollowing ? 'Takipten Çık' : 'Takip Et'}
      </Button>
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  )
}
