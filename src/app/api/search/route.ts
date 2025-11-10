import { NextResponse } from 'next/server'

import { firestoreAdmin } from '@/lib/firebase-admin'

import { buildPrefixRange, type PostSearchSummary, type UserSummary } from './utils'

// Contract:
// GET /api/search?q=term&types=users,posts&limit=10
// Returns { users: [...], posts: [...], meta: { tookMs, q, types } }
// NOTE: Firestore doesn't support true LIKE; we approximate with prefix matches using >= and < bounds.

// buildPrefixRange moved to './utils' for isolated testing without Firebase deps

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim()
  const typesParam = (url.searchParams.get('types') || 'users,posts').toLowerCase()
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 25)
  const types = typesParam.split(',').map((t) => t.trim()).filter(Boolean)

  if (!q) {
    return NextResponse.json({ users: [], posts: [], meta: { q, types, tookMs: 0 } })
  }

  const t0 = Date.now()
  const { start, end } = buildPrefixRange(q)
  const startOriginal = q
  const endOriginal = q + '\uf8ff'

  const results: { users: UserSummary[]; posts: PostSearchSummary[] } = { users: [], posts: [] }

  try {
    if (types.includes('users')) {
      const usernameQuery = await firestoreAdmin
        .collection('users')
        .where('username_lower', '>=', start)
        .where('username_lower', '<=', end)
        .limit(limit)
        .get()

      const nameQuery = await firestoreAdmin
        .collection('users')
        .where('name_lower', '>=', start)
        .where('name_lower', '<=', end)
        .limit(limit)
        .get()

      const userDocs = [...usernameQuery.docs, ...nameQuery.docs]
      const seen = new Set<string>()
      results.users = userDocs
        .filter((d) => {
          if (seen.has(d.id)) return false
          seen.add(d.id)
          return true
        })
        .slice(0, limit)
        .map<UserSummary>((d) => {
          const data = d.data() as Partial<{
            username: string
            name: string
            profilePictureUrl: string
            image: string
            team: string
          }>
          return {
            id: d.id,
            username: data.username || '',
            name: data.name || '',
            profilePictureUrl: data.profilePictureUrl || data.image || '',
            team: data.team || '',
          }
        })

      // Fallback: if no results (or too few), try case-sensitive fields as a best effort
      if (results.users.length < Math.min(3, limit)) {
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
          results.users.push({
            id: d.id,
            username: data.username || '',
            name: data.name || '',
            profilePictureUrl: data.profilePictureUrl || data.image || '',
            team: data.team || '',
          })
          seen.add(d.id)
          if (results.users.length >= limit) break
        }
      }
    }

    if (types.includes('posts')) {
      const postQuery = await firestoreAdmin
        .collection('posts')
        .where('content_lower', '>=', start)
        .where('content_lower', '<=', end)
        .orderBy('content_lower')
        .limit(limit)
        .get()

      results.posts = postQuery.docs.map<PostSearchSummary>((d) => {
        const data = d.data() as Partial<{
          authorUsername: string
          content: string
          imageUrl: string
          likeCount: number
          commentCount: number
        }>
        return {
          id: d.id,
            authorUsername: data.authorUsername || '',
            content: data.content || '',
            imageUrl: data.imageUrl || null,
            likeCount: data.likeCount || 0,
            commentCount: data.commentCount || 0,
        }
      })

      // Fallback: also try authorUsername/content fields (case-sensitive) if few results
      if (results.posts.length < Math.min(3, limit)) {
        const seenPosts = new Set(results.posts.map((p) => p.id))
        const byAuthor = await firestoreAdmin
          .collection('posts')
          .where('authorUsername', '>=', startOriginal)
          .where('authorUsername', '<=', endOriginal)
          .limit(limit)
          .get()
        const byContent = await firestoreAdmin
          .collection('posts')
          .where('content', '>=', startOriginal)
          .where('content', '<=', endOriginal)
          .limit(limit)
          .get()
        const extra = [...byAuthor.docs, ...byContent.docs]
        for (const d of extra) {
          if (seenPosts.has(d.id)) continue
          const data = d.data() as any
          results.posts.push({
            id: d.id,
            authorUsername: data.authorUsername || '',
            content: data.content || '',
            imageUrl: data.imageUrl || null,
            likeCount: data.likeCount || 0,
            commentCount: data.commentCount || 0,
          })
          seenPosts.add(d.id)
          if (results.posts.length >= limit) break
        }
      }
    }
  } catch (err: any) {
    console.error('Search error', err)
    return NextResponse.json({ error: 'search_failed', message: err.message, meta: { q, types } }, { status: 500 })
  }

  const tookMs = Date.now() - t0
  return NextResponse.json({ ...results, meta: { q, types, tookMs } })
}
