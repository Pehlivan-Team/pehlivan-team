'use client'

import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import CommentComposer from '@/components/profile/CommentComposer'
import CommentList from '@/components/profile/CommentList'
import LikeButton from '@/components/profile/LikeButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface PostDetailClientProps {
  post: {
    id: string
    authorUsername: string
    content: string
    imageUrl?: string | null
    likeCount: number
    commentCount: number
    type?: string
    linkUrl?: string | null
    createdAtMillis?: number
  }
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showComposer, setShowComposer] = useState(false)

  const createdLabel = post.createdAtMillis
    ? formatDistanceToNow(new Date(post.createdAtMillis), { addSuffix: true, locale: tr })
    : 'az önce'

  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-6 shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 border border-slate-700">
          <AvatarImage src={post.imageUrl || undefined} />
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
          {post.imageUrl && (
            <div className="relative mt-5 w-full overflow-hidden rounded-lg border border-slate-700">
              <Image
                src={post.imageUrl}
                alt="Gönderi resmi"
                width={1200}
                height={800}
                className="object-cover w-full max-h-[480px]"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}
          <div className="mt-6 border-t border-slate-700 pt-4">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <LikeButton postId={post.id} initialCount={post.likeCount} />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 px-2"
                onClick={() => setShowComposer((v) => !v)}
              >
                <MessageCircle className="h-4 w-4" /> {post.commentCount}
              </Button>
            </div>
            {showComposer && (
              <div className="mt-4">
                <CommentComposer postId={post.id} onAdded={() => setShowComposer(false)} />
              </div>
            )}
            <div className="mt-4">
              <CommentList postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
