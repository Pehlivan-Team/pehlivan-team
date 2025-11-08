"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, User, Menu as MenuIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PostComposer from "@/app/profile/[username]/_components/PostComposer";
import { cn } from "@/lib/utils";

export default function FeedMobileBottomBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const username = (session as any)?.user?.username;

  return (
    <footer className="fixed bottom-0 z-50 w-full px-2 lg:hidden print:hidden">
      <nav className="flex items-center justify-between h-16 px-4 bg-black/30 backdrop-blur-lg border-t border-white/10 rounded-t-3xl">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/feed" className={cn("p-2 rounded-full", pathname?.startsWith("/feed") ? "bg-emerald-700 text-white" : "text-gray-300 hover:bg-white/10") }>
                  <MessageSquare className="w-6 h-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Feed</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300">
                      <Plus className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-gray-950/90 backdrop-blur-lg border-l-slate-700 text-white flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="text-white text-2xl">Yeni Gönderi</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <PostComposer username={username || ""} />
                    </div>
                  </SheetContent>
                </Sheet>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yeni Gönderi</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                {username ? (
                  <Link href={`/profile/${username}`} className="p-2 rounded-full text-gray-300 hover:bg-white/10">
                    <User className="w-6 h-6" />
                  </Link>
                ) : (
                  <button onClick={() => signIn()} className="p-2 rounded-full text-gray-300 hover:bg-white/10">
                    <User className="w-6 h-6" />
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Profil</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300">
                      <MenuIcon className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-gray-950/90 backdrop-blur-lg border-l-slate-700 text-white flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="text-white text-2xl">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col space-y-4 px-4">
                      <Link href="/teams" className="py-2">Takımlar</Link>
                      <Link href="/timeline" className="py-2">Tarihçe</Link>
                      <Link href="/blog" className="py-2">Blog</Link>
                    </div>
                    <div className="mt-4 px-4">
                      {session?.user ? (
                        <Button
                          type="button"
                          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Çıkış Yap
                        </Button>
                      ) : (
                        <Button type="button" onClick={() => signIn()} className="w-full">
                          Giriş Yap
                        </Button>
                      )}
                    </div>
                    <div className="mt-auto px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          <a href="https://www.instagram.com/pehlivanteam" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">IG</a>
                          <a href="https://www.linkedin.com/company/pehlivan-team/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">IN</a>
                        </div>
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
  );
}
