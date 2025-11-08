"use client";
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FollowButton from './FollowButton';

interface UserItem { username: string; name: string; profilePictureUrl?: string }

export default function FollowListDialog({ username, type, trigger }: { username: string; type: 'followers' | 'following'; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/follow/${username}/${type}`);
        const json = await res.json();
        if (!active) return;
        setUsers(json.users || []);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [open, username, type]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{type === 'followers' ? 'Takipçiler' : 'Takip'}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto divide-y divide-slate-200/10">
          {loading ? (
            <div className="p-4 text-slate-400">Yükleniyor...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-slate-300">Liste boş.</div>
          ) : (
            users.map(u => (
              <div key={u.username} className="flex items-center gap-3 p-3">
                <Avatar className="h-10 w-10">
                  {u.profilePictureUrl ? <AvatarImage src={u.profilePictureUrl} alt={u.username} /> : <AvatarFallback>{u.username?.[0]?.toUpperCase()}</AvatarFallback>}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{u.name}</div>
                  <div className="text-slate-400 text-xs truncate">@{u.username}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href={`/profile/${u.username}`}>Profili Gör</Link>
                  </Button>
                  <FollowButton targetUsername={u.username} />
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
