"use client"
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { MoreHorizontal, Trash, Edit, MessageCircle, Heart, Loader2, ChevronLeft, ChevronRight, X, MessageSquareShareIcon, Share2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useProfile from '@/hooks/useProfile'

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
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { toast } from 'sonner'

interface PostCardProps {
  post: {
    id: string
    authorUsername: string
    content: string
    imageUrl?: string | null
    imageUrls?: string[] | null
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
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const profileHook = useProfile(post.authorUsername)
  const [authorImage, setAuthorImage] = useState<string | undefined>(undefined)

  // derive author info preference: session user > post.authorProfile (server) > profileHook
  const postAuthorProfile = (post as any).authorProfile
  const authorName =
    session?.user?.username === post.authorUsername
      ? session.user.name || post.authorUsername
      : postAuthorProfile?.name || profileHook.profile?.name || post.authorUsername

  // Check initial like status
  useEffect(() => {
    if (session?.user) {
      fetch(`/api/posts/${post.id}/like`)
        .then(res => res.json())
        .then(data => {
          if (data.liked !== undefined) {
            setLiked(data.liked)
            setLikeCount(data.likeCount ?? post.likeCount)
          }
        })
        .catch(() => {
          // Ignore errors, keep default state
        })
    }
  }, [post.id, session?.user, post.likeCount])

  async function toggleLike(e: React.MouseEvent) {
    e.stopPropagation()
    if (likeLoading) return
    setLikeLoading(true)
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setLiked(Boolean(data.liked))
        setLikeCount(data.likeCount ?? likeCount)
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

  useEffect(() => {
    // Prefer session user image when author is the session user (fast)
    if (session?.user?.username === post.authorUsername) {
      setAuthorImage(session.user.image || undefined)
      return
    }

    // Prefer server-batched author profile if present on the post
    if (postAuthorProfile && postAuthorProfile.profilePictureUrl) {
      setAuthorImage(postAuthorProfile.profilePictureUrl)
      return
    }

    // fall back to the shared profile hook
    setAuthorImage(profileHook.profile?.profilePictureUrl || undefined)
  }, [post.authorUsername, session?.user, profileHook.profile, post, postAuthorProfile])

  const images: string[] = (post as any).imageUrls ?? (post.imageUrl ? [post.imageUrl] : [])

  // viewer controls
  function openViewer(idx = 0, e?: React.MouseEvent) {
    e?.stopPropagation()
    setViewerIndex(idx)
    setViewerOpen(true)
  }

  function prevImage(e?: React.MouseEvent) {
    e?.stopPropagation()
    setViewerIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0))
  }

  function nextImage(e?: React.MouseEvent) {
    e?.stopPropagation()
    setViewerIndex((i) => (images.length ? (i + 1) % images.length : 0))
  }

  return (
    <>
      <article
        className="group w-full rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => {
          const tag = (e.target as HTMLElement).tagName.toLowerCase()
          if (['button', 'a', 'input', 'textarea', 'svg', 'path'].includes(tag)) return
          if ((e.target as HTMLElement).closest('[role="menu"], [data-radix-dropdown-menu-trigger]')) return
          router.push(`/posts/${post.id}`)
        }}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border border-slate-700">
            <AvatarImage alt={authorName} src={authorImage} />
            <AvatarFallback>{post.authorUsername?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <Link href={`/profile/${post.authorUsername}`} className="font-semibold text-white hover:underline truncate block">
                      {authorName}
                    </Link>
                    <div className="text-xs text-slate-400 truncate">@{post.authorUsername}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide bg-slate-600/20 text-slate-300 border border-slate-400/30">
                    {post.type?.replace(/_/g, ' ') || 'social'}
                  </span>
                </div>
                <div className="mt-3 whitespace-pre-wrap text-slate-100 text-sm md:text-base leading-relaxed">{post.content}</div>
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
            {images && images.length > 0 && (
              <div className="mt-4">
                {images.length === 1 ? (
                  <div className="relative mt-0 aspect-video w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                    <Image
                      src={images[0]}
                      alt="Post resmi"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 700px"
                      onClick={(e) => openViewer(0, e)}
                    />
                  </div>
                ) : images.length === 2 ? (
                  <div className="grid grid-cols-2 gap-2 mt-0">
                    {images.map((u: string, i: number) => (
                      <div key={u} className="relative h-48 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                        <Image src={u} alt={`post image ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 350px" onClick={(e) => openViewer(i, e)} />
                      </div>
                    ))}
                  </div>
                ) : images.length === 3 ? (
                  <div className="grid grid-cols-3 gap-2 mt-0">
                    {images.map((u: string, i: number) => (
                      <div key={u} className="relative h-32 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                        <Image src={u} alt={`post image ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 233px" onClick={(e) => openViewer(i, e)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-0">
                    {images.slice(0, 4).map((u: string, i: number) => (
                      <div key={u} className="relative h-32 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                        <Image src={u} alt={`post image ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 350px" onClick={(e) => openViewer(i, e)} />
                        {i === 3 && images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
                            +{images.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-slate-700/70 pt-3 flex items-center gap-3 text-slate-400 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 px-3 ${liked ? 'text-rose-400' : ''}`}
                disabled={likeLoading}
                onClick={toggleLike}
              >
                {likeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500/30 text-rose-400' : ''}`} />}
                <span className="ml-1">{likeCount}</span>
              </Button>
              <span className="h-4 w-px bg-slate-700" />
              <Button variant="ghost" size="sm" className="gap-2 px-3" onClick={() => setShowComposer(v => !v)}>
                <MessageCircle className="h-4 w-4" />
                <span className="ml-1">{post.commentCount ?? 0}</span>
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2 px-3" onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`${location.origin}/posts/${post.id}`); toast('Gönderi bağlantısı kopyalandı.', { duration: 3000 }) }}>
                  <span className="text-xs"><Share2Icon /></span>
                </Button>
              </div>
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

      {/* Image viewer dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl w-[90%] p-0 bg-transparent shadow-none">
          <VisuallyHidden>
            <DialogTitle>Image Viewer</DialogTitle>
          </VisuallyHidden>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              {images && images.length > 0 && (
                <Image src={images[viewerIndex]} alt={`image ${viewerIndex + 1}`} width={1200} height={800} className="object-contain max-h-[70vh]" />
              )}
            </div>
            <button onClick={() => setViewerOpen(false)} className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-2">
              <X className="h-4 w-4" />
            </button>
            {images && images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
