import { useEffect, useState, useCallback } from 'react'

export type LiveUser = {
  username: string
  name?: string
  image?: string | null
  bio?: string
  socialLinks?: Record<string, string>
} | null

export default function useLiveUser(username?: string, { refreshInterval = 30000 } = {}) {
  const [user, setUser] = useState<LiveUser>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = useCallback(async () => {
    if (!username) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(username)}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setUser({
        username: data.username,
        name: data.name,
        image: data.profilePictureUrl || null,
        bio: data.bio,
        socialLinks: data.socialLinks,
      })
    } catch (err: any) {
      setError(err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    if (!username) return
    let mounted = true
    fetchUser()

    const id = setInterval(() => {
      if (mounted) fetchUser()
    }, refreshInterval)

    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [username, fetchUser, refreshInterval])

  return { user, loading, error, refresh: fetchUser }
}
