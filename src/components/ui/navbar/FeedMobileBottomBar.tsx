'use client'

import { MessageSquare, Plus, User, Menu as MenuIcon, Search as SearchIcon, Instagram, Linkedin, MessageCircleCodeIcon } from 'lucide-react'
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
                  <MessageCircleCodeIcon className='w-6 h-6' />
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
                  <SheetContent className="bg-gray-950/90 backdrop-blur-lg border-l-slate-700 text-white flex flex-col p-4 rounded-t-3xl">
                    <SheetHeader>
                      <div className="flex items-center justify-between">
                        <SheetTitle className="text-slate-900 dark:text-white text-2xl">Menü</SheetTitle>
                      </div>
                    </SheetHeader>
                    <div className="mt-6 grid gap-3 py-2">
                      <Link href="/teams" className="py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">Takımlar</Link>
                      <Link href="/timeline" className="py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">Tarihçe</Link>
                      <Link href="/blog" className="py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">Blog</Link>
                      <Link href="/feed/settings" className="py-3 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">Feed Ayarları</Link>
                    </div>
                    <div className="mt-4">
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
                    <div className="mt-6 border-t pt-4 flex items-center justify-between">
                      <div className="flex space-x-4">
                        <a href="https://www.instagram.com/pehlivanteam" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-slate-700" aria-label="Instagram">
                          <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/company/pehlivan-team/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-slate-700" aria-label="LinkedIn">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                      <div className="text-sm text-gray-400">{new Date().getFullYear()} · {process.env.NEXT_PUBLIC_SITE_NAME || 'Pehlivan Team'}</div>
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
