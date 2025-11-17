"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  title: string
  author?: string | null
  authorUsername?: string | null
  authorImage?: string | null
  createdAt?: string
}

export default function AuthorHeader({ title, author, authorUsername, authorImage, createdAt }: Props) {
  const [shrunk, setShrunk] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || 0
          setShrunk(y > 120)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const avatarSize = shrunk ? 44 : 72
  const avatarClass = `rounded-full object-cover transition-all duration-200 ease-out transform ${shrunk ? 'scale-90' : 'scale-100'}`

  const profilePath = `/profile/${authorUsername || author || ''}`

  return (
    <header className="mb-6">
      <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{title}</h1>

      <div className="mt-6">
        <div className="flex items-start gap-6">
          <div className="hidden lg:block flex-shrink-0">
            <Link href={profilePath} aria-label={`Go to ${author || 'profile'}`}>
              <div style={{ width: avatarSize, height: avatarSize }} className="sticky top-24">
                <Image src={authorImage || '/default-avatar.png'} alt={author ?? ''} width={avatarSize} height={avatarSize} className={avatarClass} />
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Link href={profilePath} className="flex items-center gap-3" aria-label={`Go to ${author || 'profile'}`}>
                <div className="lg:hidden">
                  <Image src={authorImage || '/default-avatar.png'} alt={author ?? ''} width={40} height={40} className="rounded-full object-cover" />
                </div>
                <span className="font-semibold text-white hover:underline">{author}</span>
              </Link>
              {authorUsername && <span className="text-sm text-muted-foreground">@{authorUsername}</span>}
              <span className="text-sm text-muted-foreground">•</span>
              {createdAt && <span className="text-sm text-muted-foreground">{createdAt}</span>}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
