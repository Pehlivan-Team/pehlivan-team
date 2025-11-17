// Lightweight profile cache to dedupe profile fetches across components
type PublicProfile = {
  username: string
  name?: string
  profilePictureUrl?: string | null
  bio?: string
  socialLinks?: Record<string, string>
}

const cache = new Map<string, PublicProfile | null>()
const inflight = new Map<string, Promise<PublicProfile | null>>()
const subs = new Map<string, Set<() => void>>()

export function getCachedProfile(username: string) {
  return cache.get(username) ?? null
}

function notify(username: string) {
  const s = subs.get(username)
  if (!s) return
  s.forEach((cb) => cb())
}

export function subscribe(username: string, cb: () => void) {
  if (!subs.has(username)) subs.set(username, new Set())
  subs.get(username)!.add(cb)
  return () => unsubscribe(username, cb)
}

export function unsubscribe(username: string, cb: () => void) {
  const s = subs.get(username)
  if (!s) return
  s.delete(cb)
  if (s.size === 0) subs.delete(username)
}

export async function fetchProfile(username: string) {
  if (!username) return null
  // reuse inflight promise
  if (inflight.has(username)) return inflight.get(username)!

  const p = (async () => {
    try {
      const res = await fetch(`/api/profile/${encodeURIComponent(username)}`)
      if (!res.ok) {
        cache.set(username, null)
        return null
      }
      const data = await res.json()
      const normalized: PublicProfile = {
        username: data.username,
        name: data.name,
        profilePictureUrl: data.profilePictureUrl || null,
        bio: data.bio,
        socialLinks: data.socialLinks,
      }
      cache.set(username, normalized)
      return normalized
    } catch (err) {
      cache.set(username, null)
      return null
    } finally {
      inflight.delete(username)
      notify(username)
    }
  })()

  inflight.set(username, p)
  return p
}

export function refreshProfile(username: string) {
  cache.delete(username)
  return fetchProfile(username)
}
