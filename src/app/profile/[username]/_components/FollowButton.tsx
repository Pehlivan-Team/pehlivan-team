"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession, signIn } from 'next-auth/react';

export default function FollowButton({ targetUsername }: { targetUsername: string }) {
  const { data: session, status } = useSession();
  const viewerUsername = (session as any)?.user?.username;
  const isOwner = viewerUsername && viewerUsername === targetUsername;
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/follow/${targetUsername}`);
        const json = await res.json();
        if (!active) return;
        setIsFollowing(Boolean(json.isFollowing));
      } catch {}
      finally { if (active) setLoading(false); }
    }
    if (!isOwner) load(); else setLoading(false);
    return () => { active = false; };
  }, [targetUsername, isOwner]);

  if (isOwner) return null;

  if (status === 'unauthenticated') {
    return (
      <Button variant="secondary" onClick={() => signIn()}>
        Giriş Yap
      </Button>
    );
  }

  return (
    <Button
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        try {
          const method = isFollowing ? 'DELETE' : 'POST';
          const res = await fetch(`/api/follow/${targetUsername}`, { method });
          const json = await res.json();
          setIsFollowing(Boolean(json.isFollowing));
        } finally {
          setLoading(false);
        }
      }}
      className={isFollowing ? 'bg-slate-700 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-700'}
      disabled={loading}
    >
      {loading ? '...' : isFollowing ? 'Takipten Çık' : 'Takip Et'}
    </Button>
  );
}
