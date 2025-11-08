"use client";

import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { User, Settings, Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostComposer from "@/app/profile/[username]/_components/PostComposer";
import { Button } from "@/components/ui/button";

export default function FeedProfileSidebar() {
    const { data: session } = useSession();

    const username = (session as any)?.user?.username;
    const name = (session as any)?.user?.name || (session as any)?.user?.email;
    const image = (session as any)?.user?.image;

    const pathname = usePathname();

    return (
        // Sidebar is now in-flow (non-fixed). On mobile it becomes a full-width block above content;
        // on large screens it occupies the left column (lg:col-span-3) with a constrained height.
        <aside className="block w-full lg:col-span-3 rounded-lg border border-slate-700 bg-slate-900/80 p-4 text-white overflow-auto lg:max-h-[80vh]">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">
                    <Link href="/feed" className="flex items-center gap-2 hover:underline">
                        Sosyalleş
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </h3>
                <p className="text-sm text-slate-400">Hızlı erişimler ve profiliniz</p>
            </div>
            {session?.user ? (
                <div className="space-y-3">

                    <div className="flex flex-col items-center gap-3">
                        {username ? (
                            <Link href={`/profile/${username}`} className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border border-slate-700">
                                    {image ? (
                                        <AvatarImage src={image} alt={name || "avatar"} />
                                    ) : (
                                        <AvatarFallback>
                                            <User className="h-6 w-6 text-slate-400" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">{name}</div>
                                    <div className="text-xs text-slate-400 truncate">@{username}</div>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border border-slate-700">
                                    <AvatarFallback>
                                        <User className="h-6 w-6 text-slate-400" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">{name}</div>
                                    <div className="text-xs text-slate-400 truncate">(not signed in)</div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 w-full mt-3">
                            {/* If user not signed-in, show sign-in CTA */}
                            {!session?.user && (
                                <div className="flex gap-2">
                                    <button onClick={() => signIn()} className="flex-1 rounded px-3 py-2 bg-emerald-700/20 hover:bg-emerald-700/30">
                                        Giriş Yap
                                    </button>
                                    <Link href="/auth/register" className="flex-1 rounded px-3 py-2 bg-slate-800 hover:bg-slate-700 text-center">
                                        Kayıt Ol
                                    </Link>
                                </div>
                            )}

                            <Button
                                type="button"
                                className="rounded px-3 py-2 bg-red-600 hover:bg-red-700 text-sm flex items-center gap-2"
                                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" /> Çıkış Yap
                            </Button>

                            <Button disabled className="rounded px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-2">

                                <Settings className="w-4 h-4" /> Feed Ayarları
                            </Button >

                            <Button disabled className="rounded px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-2">

                                <Users className="w-4 h-4" /> Takipçiler
                            </Button >
                            {/* Show 'Go to Feed' when not already on feed */}

                        </div>
                        {/* Quick composer */}
                        <div>
                            <PostComposer username={username || ""} />
                        </div>

                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-slate-300">Giriş yapmadınız.</p>
                    <div className="flex gap-2">
                        <button onClick={() => signIn()} className="flex-1 rounded px-3 py-2 bg-emerald-700/20 hover:bg-emerald-700/30">
                            Giriş Yap
                        </button>
                        <Link href="/auth/register" className="flex-1 rounded px-3 py-2 bg-slate-800 hover:bg-slate-700 text-center">
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            )}

            <div className="mt-6 border-t border-slate-700 pt-4 text-sm text-slate-400">
                Gelecek özellikler: hesap filtreleri, bildirimler, etiketler.
            </div>
        </aside>
    );
}
