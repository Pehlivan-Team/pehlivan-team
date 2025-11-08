"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SearchUser = {
    id: string;
    username: string;
    name: string;
    profilePictureUrl: string;
    team?: string;
};

type SearchPost = {
    id: string;
    authorUsername: string;
    content: string;
    imageUrl?: string | null;
    likeCount: number;
    commentCount: number;
};

export default function SearchPage() {
    const [q, setQ] = React.useState("");
    const [tab, setTab] = React.useState<"all" | "users" | "posts">("all");
    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState<SearchUser[]>([]);
    const [posts, setPosts] = React.useState<SearchPost[]>([]);
    const [err, setErr] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!q.trim()) {
            setUsers([]);
            setPosts([]);
            setErr(null);
            return;
        }

        const ctrl = new AbortController();
        const t = setTimeout(async () => {
            setLoading(true);
            setErr(null);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&types=users,posts&limit=10`, {
                    signal: ctrl.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setUsers(data.users || []);
                setPosts(data.posts || []);
            } catch (e: any) {
                if (e.name !== "AbortError") setErr(e.message);
            } finally {
                setLoading(false);
            }
        }, 300); // debounce

        return () => {
            ctrl.abort();
            clearTimeout(t);
        };
    }, [q]);

    const showUsers = tab === "all" || tab === "users";
    const showPosts = tab === "all" || tab === "posts";

    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-800 to-emerald-900">
            <main className="container mx-auto max-w-4xl py-8 px-4">
                <h1 className="text-3xl font-bold text-white mb-6">Ara</h1>

                <div className="mb-4">
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Kullanıcı, gönderi..."
                        className="bg-slate-900/70 text-white border-slate-700"
                    />
                </div>

                <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="text-white">
                    <TabsList className="bg-slate-800 text-white">
                        <TabsTrigger value="all">Tümü</TabsTrigger>
                        <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
                        <TabsTrigger value="posts">Gönderiler</TabsTrigger>
                    </TabsList>

                    {loading && <p className="mt-4 text-slate-300">Aranıyor...</p>}
                    {err && <p className="mt-4 text-red-400">Hata: {err}</p>}

                    {showUsers && (
                        <TabsContent value="users" className="mt-4">
                            {users.length === 0 && !loading ? (
                                <p className="text-slate-300">Kullanıcı bulunamadı.</p>
                            ) : (
                                <div className="space-y-2">
                                    {users.map((u) => (
                                        <Link key={u.id} href={`/profile/${u.username}`} className="block">
                                            <Card className="bg-slate-900/70 border-slate-700 hover:bg-slate-900">
                                                <CardContent className="p-3 flex items-center gap-3">
                                                    <Image
                                                        src={u.profilePictureUrl || "/avatar.png"}
                                                        alt={u.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{u.name}</div>
                                                        <div className="text-xs text-slate-400">@{u.username}</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    )}

                    {showPosts && (
                        <TabsContent value="posts" className="mt-6">
                            {posts.length === 0 && !loading ? (
                                <p className="text-slate-300">Gönderi bulunamadı.</p>
                            ) : (
                                <div className="space-y-3">
                                    {posts.map((p) => (
                                        <Card key={p.id} className="bg-slate-900/70 border-slate-700">
                                            <CardContent className="p-4">
                                                <div className="text-sm text-slate-400 mb-1">@{p.authorUsername}</div>
                                                <div className="whitespace-pre-wrap text-white">{p.content}</div>
                                                {p.imageUrl && (
                                                    <div className="mt-2">
                                                        <Image src={p.imageUrl} alt="post" width={600} height={400} className="rounded-lg" />
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    )}
                </Tabs>
            </main>
        </div>
    );
}
