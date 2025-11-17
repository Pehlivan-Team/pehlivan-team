import { useEffect, useState, useCallback } from 'react'
import { fetchProfile, getCachedProfile, subscribe, refreshProfile } from './profileCache'

export default function useProfile(username?: string) {
  const [profile, setProfile] = useState(() => (username ? getCachedProfile(username) : null))
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!username) return
    setLoading(true)
    const p = await fetchProfile(username)
    setProfile(p)
    setLoading(false)
  }, [username])

  useEffect(() => {
    if (!username) return
    let mounted = true
    const cb = () => {
      if (!mounted) return
      setProfile(getCachedProfile(username))
    }
    // subscribe to cache updates
    const unsub = subscribe(username, cb)

    // if nothing in cache, trigger load
    if (getCachedProfile(username) == null) {
      load()
    }

    return () => {
      mounted = false
      unsub()
    }
  }, [username, load])

  return { profile, loading, refresh: () => refreshProfile(username || '') }
}
