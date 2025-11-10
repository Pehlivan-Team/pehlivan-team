'use client'

import { Search, X } from 'lucide-react'
import { useState, useMemo } from 'react'

import PostCard from '@/components/post/PostCard'
import { Button } from '@/components/ui/button'

import type { Post } from '@/types/posts'

interface FeedSearchBoxProps {
  initialPosts: Post[]
}

export default function FeedSearchBox({ initialPosts }: FeedSearchBoxProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return initialPosts
    return initialPosts.filter((p) => {
      return (
        p.content?.toLowerCase().includes(q) ||
        p.authorUsername.toLowerCase().includes(q) ||
        (p.type && p.type.toLowerCase().includes(q)) ||
        (p.linkUrl && p.linkUrl.toLowerCase().includes(q))
      )
    })
  }, [initialPosts, query])

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara: içerik, kullanıcı, tür, link..."
          className="w-full bg-slate-800 border border-slate-700 rounded pl-9 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query && (
        <div className="text-xs text-slate-400">
          {filtered.length} sonuç • "{query}"
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {!filtered.length && (
          <div className="text-center py-12 border border-dashed border-slate-700 rounded bg-slate-800 text-slate-400 text-sm">
            Sonuç bulunamadı.
          </div>
        )}
      </div>
    </div>
  )
}
