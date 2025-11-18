'use client'

import {
  MessageSquare,
  Plus,
  User,
  Menu as MenuIcon,
  Search as SearchIcon,
  Instagram,
  Linkedin,
  MessageCircleCodeIcon,
  Users,
  CalendarClock,
  FileText,
  FolderGit2,
  Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import React from 'react'

import PostComposer from '@/components/profile/PostComposer'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '../drawer'
import { PersonIcon } from '@radix-ui/react-icons'

export default function FeedMobileBottomBar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const username = (session as any)?.user?.username

  return (
    <footer className="fixed bottom-0 z-50 w-full px-2 lg:hidden print:hidden">
      <nav className="flex items-center justify-between h-16 px-4 bg-black/30 backdrop-blur-lg border-t border-white/10 rounded-t-3xl">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/feed"
                  aria-label="Feed"
                  className={cn(
                    'p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                    pathname?.startsWith('/feed')
                      ? 'bg-emerald-700 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  )}
                >
                  <img
                    src="/tp-sosyal.svg"
                    alt="Pehlivan Team Social"
                    className="h-8 w-auto brightness-0 invert"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Feed</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/search"
                  aria-label="Arama"
                  className={cn(
                    'p-2 rounded-full',
                    pathname?.startsWith('/search')
                      ? 'bg-emerald-700 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  )}
                >
                  <SearchIcon className="w-6 h-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Arama</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                {username ? (
                  <Link
                    href={`/messages`}
                    aria-label="messages"
                    className="p-2 rounded-full text-gray-300 hover:bg-white/10"
                  >
                    <MessageSquare className="w-6 h-6" />
                  </Link>
                ) : (
                  null)}
              </TooltipTrigger>
              <TooltipContent>
                <p>Mesajlar</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                {username ? (
                  <Link
                    href={`/profile/${username}`}
                    aria-label="Profil"
                    className="p-2 rounded-full text-gray-300 hover:bg-white/10"
                  >
                    <User className="w-6 h-6" />
                  </Link>
                ) : (
                  <button
                    onClick={() => signIn()}
                    aria-label="Giriş Yap"
                    className="p-2 rounded-full text-gray-300 hover:bg-white/10"
                  >
                    <User className="w-6 h-6" />
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Profil</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {session?.user ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300"
                  aria-label="Yeni Gönderi"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerTitle className='hidden'>Yeni Gönderi</DrawerTitle>
              <DrawerContent
                className="bg-gray-950/90 backdrop-blur-lg border-l-slate-700 text-white flex flex-col p-4 rounded-t-3xl"

              >
                <PostComposer username={session.user.username} />
              </DrawerContent>

            </Drawer>

          ) : (
            null
          )}
        </div>



        <div className="pr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300" aria-label="Daha Fazla">
                      <MenuIcon className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-gray-950/95 backdrop-blur-lg border-l-slate-700 text-white flex flex-col p-6 rounded-t-3xl h-full">
                    <SheetHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src="/tp-sosyal.svg"
                            alt="Pehlivan Team Social"
                            className="h-8 w-auto brightness-0 invert"
                          />
                          <SheetTitle className="text-white text-2xl font-bold">Menü</SheetTitle>
                        </div>
                      </div>
                    </SheetHeader>

                    {/* Main content with flex-grow */}
                    <div className="flex-grow flex flex-col">
                      <div className="grid gap-2 py-2">
                        <Link href="/teams" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <Users className="w-5 h-5" />
                          <span>Takımlar</span>
                        </Link>
                        <Link href="/timeline" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <CalendarClock className="w-5 h-5" />
                          <span>Timeline</span>
                        </Link>
                        <Link href="/blog" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <FileText className="w-5 h-5" />
                          <span>Blog</span>
                        </Link>
                        <Link href="/projects" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <FolderGit2 className="w-5 h-5" />
                          <span>Projeler</span>
                        </Link>
                        <Link href="/shortener" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <LinkIcon className="w-5 h-5" />
                          <span>Kısaltıcı</span>
                        </Link>
                      </div>


                    </div>
                    {/* Footer pushed to bottom */}
                    <div className="border-t border-slate-700 pt-4 mt-auto">
                      {/* Auth button in footer */}
                      <div className="mb-4">
                        {session?.user ? (
                          <Button
                            type="button"
                            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            Çıkış Yap
                          </Button>
                        ) : (
                          <Button type="button" onClick={() => signIn()} className="w-full">Giriş Yap</Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          <a href="https://www.instagram.com/pehlivanteam" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-slate-400 transition-colors" aria-label="Instagram">
                            <Instagram className="w-5 h-5" />
                          </a>
                          <a href="https://www.linkedin.com/company/pehlivan-team/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-slate-400 transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        </div>
                        <div className="text-sm text-gray-400">{new Date().getFullYear()} · {process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team'}</div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </TooltipTrigger>
              <TooltipContent>
                <p>Daha Fazla</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </footer>
  )
}
