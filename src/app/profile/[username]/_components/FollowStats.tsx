"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import FollowListDialog from './FollowListDialog';

interface FollowStatsProps {
  username: string;
}

export default function FollowStats({ username }: FollowStatsProps) {
  const [counts, setCounts] = useState<{ followers: number; following: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/follow/${username}`);
        const json = await res.json();
        if (!active) return;
        setCounts({ followers: json.followersCount || 0, following: json.followingCount || 0 });
      } catch {
        if (active) setCounts({ followers: 0, following: 0 });
      } finally {
        if (active) setLoading(false);
      }
    }
    if (username) load();
    return () => { active = false; };
  }, [username]);

  if (loading) {
    return <div className="flex gap-2 text-xs text-slate-400">Yükleniyor...</div>;
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <FollowListDialog
        username={username}
        type="followers"
        trigger={
          <button className="hover:underline flex items-center gap-1" type="button">
            <span className="font-semibold text-white">{counts?.followers ?? 0}</span>
            <span className="text-slate-400">Takipçi</span>
          </button>
        }
      />
      <FollowListDialog
        username={username}
        type="following"
        trigger={
          <button className="hover:underline flex items-center gap-1" type="button">
            <span className="font-semibold text-white">{counts?.following ?? 0}</span>
            <span className="text-slate-400">Takip</span>
          </button>
        }
      />
    </div>
  );
}
