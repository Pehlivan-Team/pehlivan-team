"use client"
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { MoreHorizontal, Trash, Edit, MessageCircle, Heart, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PostCardProps {
  post: {
    id: string
    authorUsername: string
    content: string
    imageUrl?: string | null
    likeCount: number
    commentCount: number
    type?: string
    linkUrl?: string | null
    createdAt?: { toDate?: () => Date }
  }
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const isAuthor = session?.user?.username === post.authorUsername

  const createdLabel = post.createdAt?.toDate
    ? formatDistanceToNow(post.createdAt.toDate() as Date, { addSuffix: true, locale: tr })
    : 'az önce'

  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showComposer, setShowComposer] = useState(false)

  async function toggleLike(e: React.MouseEvent) {
    e.stopPropagation()
    if (likeLoading) return
    setLikeLoading(true)
    try {
      const method = liked ? 'DELETE' : 'POST'
      const res = await fetch(`/api/posts/${post.id}/likes`, { method })
      if (res.ok) {
        const data = await res.json()
        setLiked(Boolean(data.liked))
        setLikeCount(data.count ?? likeCount + (liked ? -1 : 1))
      }
    } finally {
      setLikeLoading(false)
    }
  }

  async function deletePost() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (res.ok) {
        setShowDelete(false)
        router.refresh()
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <article
        className="group w-full rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => {
          const tag = (e.target as HTMLElement).tagName.toLowerCase()
            if (['button','a','input','textarea','svg','path'].includes(tag)) return
            if ((e.target as HTMLElement).closest('[role="menu"], [data-radix-dropdown-menu-trigger]')) return
            router.push(`/posts/${post.id}`)
        }}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border border-slate-700">
            <AvatarImage alt={post.authorUsername} />
            <AvatarFallback>{post.authorUsername?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <Link href={`/profile/${post.authorUsername}`} className="font-semibold text-white hover:underline truncate">
                    {post.authorUsername}
                  </Link>
                  <span className="text-xs text-slate-400 truncate">@{post.authorUsername}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide bg-slate-600/20 text-slate-300 border border-slate-400/30">
                    {post.type?.replace(/_/g,' ') || 'social'}
                  </span>
                </div>
                <div className="mt-2 whitespace-pre-wrap text-slate-100">{post.content}</div>
                {post.linkUrl && (
                  <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-emerald-400 text-sm underline break-all">
                    {post.linkUrl}
                  </a>
                )}
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-slate-400 whitespace-nowrap">{createdLabel}</span>
                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowDelete(true)} className="text-red-500 focus:text-red-500">
                        <Trash className="mr-2 h-4 w-4" /> Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            {post.imageUrl && (
              <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg border border-slate-700">
                <Image
                  src={post.imageUrl}
                  alt="Post resmi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                  onClick={(e) => { e.stopPropagation(); router.push(`/posts/${post.id}`) }}
                />
              </div>
            )}
            <div className="mt-4 border-t border-slate-700/70 pt-3 flex items-center gap-2 text-slate-400 text-xs">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 px-2 ${liked ? 'text-rose-400' : ''}`}
                disabled={likeLoading}
                onClick={toggleLike}
              >
                {likeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500/30 text-rose-400' : ''}`} />}
                <span>{likeCount}</span>
              </Button>
              <span className="h-4 w-px bg-slate-700" />
              <Button variant="ghost" size="sm" className="gap-2 px-2" onClick={() => setShowComposer(v => !v)}>
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount ?? 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
