"use client"

import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import useProfile from '@/hooks/useProfile'

import CommentComposer from '@/components/profile/CommentComposer'
import CommentList, { CommentListRef } from '@/components/profile/CommentList'
import LikeButton from '@/components/profile/LikeButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
// server-admin SDK is not available in client components; we'll fetch the public profile via the API route

interface PostDetailClientProps {
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
    createdAtMillis?: number
  }
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const { data: session } = useSession()
  const [showComposer, setShowComposer] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const commentListRef = useRef<CommentListRef>(null)

  const handleCommentAdded = () => {
    setShowComposer(false)
    commentListRef.current?.refresh()
  }

  // Prefer session user when available to avoid an extra fetch. If the server batched
  // author profile is attached to the post (post.authorProfile), prefer that too.
  const profileHook = useProfile(post.authorUsername)
  const postAuthorProfile = (post as any).authorProfile
  const author =
    session?.user?.username === post.authorUsername
      ? session.user
      : postAuthorProfile
      ? {
          username: postAuthorProfile.username,
          name: postAuthorProfile.name,
          image: postAuthorProfile.profilePictureUrl || null,
          bio: postAuthorProfile.bio,
        }
      : profileHook.profile



  const createdLabel = post.createdAtMillis
    ? formatDistanceToNow(new Date(post.createdAtMillis), { addSuffix: true, locale: tr })
    : 'az önce'

  const images: string[] = (post as any).imageUrls ?? (post.imageUrl ? [post.imageUrl] : [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!viewerOpen) return
      if (e.key === 'ArrowLeft') setViewerIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0))
      if (e.key === 'ArrowRight') setViewerIndex((i) => (images.length ? (i + 1) % images.length : 0))
      if (e.key === 'Escape') setViewerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewerOpen, images.length])

  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-6 pt-16 shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 border border-slate-700">
          <AvatarImage src={author?.image} />
          <AvatarFallback>{post.authorUsername?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${post.authorUsername}`} className="font-semibold text-white hover:underline truncate">
              {post.authorUsername}
            </Link>
            <span className="text-xs text-slate-400">@{post.authorUsername}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide bg-slate-600/20 text-slate-300 border border-slate-400/30">
              {post.type?.replace(/_/g, ' ') || 'social'}
            </span>
            <span className="text-xs text-slate-500 ml-auto">{createdLabel}</span>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-slate-100 text-sm md:text-base leading-relaxed">
            {post.content}
          </div>
          {post.type === 'linked' && post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-emerald-400 text-sm underline break-all"
            >
              {post.linkUrl}
            </a>
          )}
          {images && images.length > 0 && (
            <div className="mt-6">
              {images.length === 1 ? (
                <div className="relative mt-0 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                  <Image
                    src={images[0]}
                    alt="Gönderi resmi"
                    width={1200}
                    height={800}
                    className="object-contain w-full max-h-[560px]"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                    onClick={() => { setViewerIndex(0); setViewerOpen(true) }}
                  />
                </div>
              ) : images.length === 2 ? (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((u: string, i: number) => (
                    <div key={u} className="relative h-64 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                      <Image src={u} alt={`post image ${i+1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 400px" onClick={() => { setViewerIndex(i); setViewerOpen(true) }} />
                    </div>
                  ))}
                </div>
              ) : images.length === 3 ? (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((u: string, i: number) => (
                    <div key={u} className="relative h-48 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                      <Image src={u} alt={`post image ${i+1}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 300px" onClick={() => { setViewerIndex(i); setViewerOpen(true) }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((u: string, i: number) => (
                    <div key={u} className="relative h-48 w-full overflow-hidden rounded-md border border-slate-700 hover:shadow-lg transition-transform transform-gpu hover:scale-[1.01] cursor-pointer">
                      <Image src={u} alt={`post image ${i+1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 400px" onClick={() => { setViewerIndex(i); setViewerOpen(true) }} />
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

          <div className="mt-6 border-t border-slate-700 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <LikeButton postId={post.id} initialCount={post.likeCount} />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 px-3"
                onClick={() => setShowComposer((v) => !v)}
              >
                <MessageCircle className="h-4 w-4" /> <span className="ml-1">{post.commentCount}</span>
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2 px-3" onClick={() => navigator.clipboard?.writeText(`${location.origin}/posts/${post.id}`)}>
                  <span className="text-xs">Linki Kopyala</span>
                </Button>
              </div>
            </div>
            {showComposer && (
              <div className="mt-4">
                <CommentComposer postId={post.id} onAdded={handleCommentAdded} />
              </div>
            )}
            <div className="mt-4">
              <CommentList ref={commentListRef} postId={post.id} />
            </div>
          </div>
        </div>
      </div>
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
                <button onClick={() => setViewerIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0))} className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={() => setViewerIndex((i) => (images.length ? (i + 1) % images.length : 0))} className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
