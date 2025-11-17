import { NextResponse } from 'next/server'

import { firestoreAdmin } from '@/lib/firebase-admin'
import { buildPrefixRange } from '../utils'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim()
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 25)

  if (!q) {
    return NextResponse.json({ users: [] })
  }

  const { start, end } = buildPrefixRange(q)
  const startOriginal = q
  const endOriginal = q + '\uf8ff'

  try {
    // Search by username (lowercase)
    const usernameQuery = await firestoreAdmin
      .collection('users')
      .where('username_lower', '>=', start)
      .where('username_lower', '<=', end)
      .limit(limit)
      .get()

    // Search by name (lowercase)
    const nameQuery = await firestoreAdmin
      .collection('users')
      .where('name_lower', '>=', start)
      .where('name_lower', '<=', end)
      .limit(limit)
      .get()

    // Combine and deduplicate results
    const userDocs = [...usernameQuery.docs, ...nameQuery.docs]
    const seen = new Set<string>()
    
    let users = userDocs
      .filter((d) => {
        if (seen.has(d.id)) return false
        seen.add(d.id)
        return true
      })
      .slice(0, limit)
      .map((d) => {
        const data = d.data() as Partial<{
          username: string
          name: string
          profilePictureUrl: string
          image: string
          team: string
          isActive: boolean
        }>
        return {
          id: d.id,
          username: data.username || '',
          name: data.name || '',
          profilePictureUrl: data.profilePictureUrl || data.image || '',
          team: data.team || '',
          isActive: data.isActive !== false // Default to true if not set
        }
      })

    // Fallback: if no results, try case-sensitive search
    if (users.length < Math.min(3, limit)) {
      const fallbackUsername = await firestoreAdmin
        .collection('users')
        .where('username', '>=', startOriginal)
        .where('username', '<=', endOriginal)
        .limit(limit)
        .get()
        
      const fallbackName = await firestoreAdmin
        .collection('users')
        .where('name', '>=', startOriginal)
        .where('name', '<=', endOriginal)
        .limit(limit)
        .get()

      const extra = [...fallbackUsername.docs, ...fallbackName.docs]
      for (const d of extra) {
        if (seen.has(d.id)) continue
        const data = d.data() as any
        users.push({
          id: d.id,
          username: data.username || '',
          name: data.name || '',
          profilePictureUrl: data.profilePictureUrl || data.image || '',
          team: data.team || '',
          isActive: data.isActive !== false
        })
        seen.add(d.id)
        if (users.length >= limit) break
      }
    }

    // Filter out inactive users and sort by relevance
    users = users
      .filter(user => user.isActive)
      .sort((a, b) => {
        // Prioritize exact username matches
        const aUsernameMatch = a.username.toLowerCase().includes(q.toLowerCase())
        const bUsernameMatch = b.username.toLowerCase().includes(q.toLowerCase())
        
        if (aUsernameMatch && !bUsernameMatch) return -1
        if (!aUsernameMatch && bUsernameMatch) return 1
        
        // Then prioritize name matches
        const aNameMatch = a.name.toLowerCase().includes(q.toLowerCase())
        const bNameMatch = b.name.toLowerCase().includes(q.toLowerCase())
        
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1
        
        // Finally sort alphabetically by name
        return a.name.localeCompare(b.name)
      })

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error('User search error:', err)
    return NextResponse.json(
      { error: 'search_failed', message: err.message }, 
      { status: 500 }
    )
  }
}