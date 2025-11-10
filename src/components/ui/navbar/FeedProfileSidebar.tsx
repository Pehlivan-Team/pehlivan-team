'use client'

import {
  User,
  Settings,
  Users,
  ArrowRight,
  Bell,
  Bookmark,
  MessageCircle,
  Search as SearchIcon,
  FileText,
  FolderGit2,
  CalendarClock,
  Link as LinkIcon,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import React, { useMemo, useState } from 'react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import PostComposer from '../../profile/PostComposer'

export default function FeedProfileSidebar() {
  const { data: session } = useSession()

  const username = (session as any)?.user?.username
  const name = (session as any)?.user?.name || (session as any)?.user?.email
  const image = (session as any)?.user?.image

  const pathname = usePathname()
  const signedIn = Boolean(session?.user)
  const [composeOpen, setComposeOpen] = useState(false)

  const nav = useMemo(
    () => [

      { href: '/feed', label: 'Sosyalleş', Icon: MessageCircle },
      { href: '/search', label: 'Ara', Icon: SearchIcon },
      { href: '/blog', label: 'Blog', Icon: FileText },
      { href: '/projects', label: 'Projeler', Icon: FolderGit2 },
      { href: '/timeline', label: 'Timeline', Icon: CalendarClock },
      { href: '/shortener', label: 'Kısaltıcı', Icon: LinkIcon },
    ],
    []
  )

  function NavItem({ href, label, Icon }: { href: string; label: string; Icon: any }) {
    const active = pathname?.startsWith(href)
    return (
      <Button
        asChild
        variant="ghost"
        className={`justify-start gap-2 px-3 py-2 rounded-md border ${
          active
            ? 'bg-emerald-600/10 border-emerald-700/40 text-emerald-300'
            : 'bg-transparent border-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white'
        }`}
      >
        <Link href={href}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full mr-2 ${active ? 'bg-emerald-400' : 'bg-transparent'}`} />
          <Icon className="h-4 w-4" /> {label}
        </Link>
      </Button>
    )
  }

  return (
    // Sidebar is now in-flow (non-fixed). On mobile it becomes a full-width block above content;
    // on large screens it occupies the left column (lg:col-span-3) with a constrained height.
  <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col gap-4 overflow-y-auto border-r border-slate-800 bg-slate-950/90 px-4 py-5 text-white backdrop-blur supports-[backdrop-filter]:backdrop-blur-md lg:flex">
      {/* User header */}
      <div className="mb-2">
        <Link href={username ? `/profile/${username}` : '/feed'} className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-slate-800">
            {image ? (
              <AvatarImage src={image} alt={name || 'avatar'} />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5 text-slate-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-semibold text-white/90">{name || 'Kullanıcı'}</div>
            <div className="text-xs text-slate-500 truncate">{username ? `@${username}` : '(giriş yok)'}</div>
          </div>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          {signedIn ? (
            <Collapsible open={composeOpen} onOpenChange={setComposeOpen} className="w-full">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button className="flex-1 justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-700">
                    <Plus className="h-4 w-4" /> Yeni Gönderi
                  </Button>
                </CollapsibleTrigger>
                <Link
                  href="/feed/settings"
                  className="rounded px-3 py-2 bg-slate-900/70 hover:bg-slate-800 text-sm flex items-center gap-2 border border-slate-800"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
              <CollapsibleContent className="mt-2">
                <PostComposer username={username || ''} />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <>
              <Button onClick={() => signIn()} className="flex-1 justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-700">
                <Plus className="h-4 w-4" /> Giriş yap ve paylaş
              </Button>
              <Link
                href="/auth/register"
                className="rounded px-3 py-2 bg-slate-900/70 hover:bg-slate-800 text-sm flex items-center gap-2 border border-slate-800"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
      <Separator className="bg-slate-800" />

      {/* Navigation */}
      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Gezin</div>
          <div className="grid grid-cols-1 gap-1.5">
            {nav.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Yakında</div>
          <div className="grid grid-cols-1 gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled className="justify-start gap-2 bg-transparent text-slate-500 border border-slate-800">
                    <Bell className="h-4 w-4" /> Bildirimler
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yakında</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled className="justify-start gap-2 bg-transparent text-slate-500 border border-slate-800">
                    <Bookmark className="h-4 w-4" /> Kaydedilenler
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yakında</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled className="justify-start gap-2 bg-transparent text-slate-500 border border-slate-800">
                    <MessageCircle className="h-4 w-4" /> Mesajlar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yakında</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {signedIn && (
          <div className="pt-2">
            <Button
              type="button"
              className="w-full justify-center rounded-md bg-red-600 hover:bg-red-700 text-sm flex items-center gap-2"
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Çıkış Yap
            </Button>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 text-xs text-slate-600">
        <div className="space-y-1">
          <p className="font-medium text-slate-400">Sürüm</p>
          <p className="">v0.1.0-alpha • Geri bildirim için Discord</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
          <span className="rounded bg-slate-800 px-2 py-1">Performans</span>
          <span className="rounded bg-slate-800 px-2 py-1">Gizlilik</span>
          <span className="rounded bg-slate-800 px-2 py-1">Destek</span>
        </div>
      </div>
    </aside>
  )
}
