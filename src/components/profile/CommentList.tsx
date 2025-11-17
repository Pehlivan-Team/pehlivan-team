"use client"
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface CommentListProps {
  postId: string
}

interface SimpleComment {
  id: string
  username: string
  content: string
}

export interface CommentListRef {
  refresh: () => void
}

const CommentList = forwardRef<CommentListRef, CommentListProps>(function CommentList({ postId }, ref) {
  const session = useSession()

  const [comments, setComments] = useState<SimpleComment[]>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingComments, setDeletingComments] = useState<Set<string>>(new Set())

  async function deleteComment(commentId: string) {
    if (deletingComments.has(commentId)) return
    
    setDeletingComments(prev => new Set(prev).add(commentId))
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to delete comment' }))
        throw new Error(errorData.error || 'Failed to delete comment')
      }
      
      // Remove comment from local state
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (e: any) {
      console.error('Delete comment error:', e)
      // You could show a toast notification here
    } finally {
      setDeletingComments(prev => {
        const next = new Set(prev)
        next.delete(commentId)
        return next
      })
    }
  }

  async function load(initial = false) {
    if (loading) return
    if (initial) setInitialLoading(true)
    setLoading(true)
    try {
      const url = new URL(`/api/posts/${postId}/comments`, window.location.origin)
      if (!initial && cursor) url.searchParams.set('cursor', cursor)
      const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
      if (!res.ok) {
        let body = ''
        try {
          const json = await res.json()
          body = JSON.stringify(json)
        } catch (_) {
          body = await res.text()
        }
        throw new Error(`Yorumlar alınamadı (${res.status}): ${body}`)
      }
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

  useImperativeHandle(ref, () => ({
    refresh: () => load(true)
  }), [postId])

  useEffect(() => {
    load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  if (initialLoading) return <div className="mt-3 text-xs text-slate-500">Yorumlar yükleniyor…</div>
  if (error) return <div className="mt-3 text-xs text-red-400">{error}</div>
  if (!comments.length) return <div className="mt-3 text-xs text-slate-500">Henüz yorum yok.</div>

  const user = session?.data?.user
  
  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {comments.map((c) => {
          const isAuthor = user?.username === c.username
          const isAdmin = user?.isAdmin === true
          const canDelete = isAuthor || isAdmin
          const isDeleting = deletingComments.has(c.id)
          
          return (
            <li
              key={c.id}
              className="rounded-md bg-slate-800/60 border border-slate-700 px-3 py-2 text-sm text-slate-200 flex flex-row"
            >
              <div className='flex flex-auto'>
                <div className="text-emerald-300 mr-2 font-mono">@{c.username}</div>
                <div className="whitespace-pre-wrap">{c.content}</div>
              </div>
              <div className='content-end justify-end '>
                {canDelete && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => deleteComment(c.id)} 
                        className="text-red-500 focus:text-red-500"
                        disabled={isDeleting}
                      >
                        <Trash2Icon className="mr-2 h-4 w-4" /> 
                        {isDeleting ? 'Siliniyor...' : 'Sil'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </li>
          )
        })}
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
})

export default CommentList
