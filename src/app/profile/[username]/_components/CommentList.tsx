'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function load(initial = false) {
    if (loading) return;
    setLoading(true);
    try {
      const url = new URL(`/api/posts/${postId}/comments`, window.location.origin);
      if (!initial && cursor) url.searchParams.set('cursor', cursor);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setComments((prev) => (initial ? data.comments : [...prev, ...data.comments]));
      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <div className="mt-3">
      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="text-sm text-slate-200">
            <span className="text-slate-400 mr-2">@{c.username}</span>
            {c.content}
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-2">
          <Button size="sm" variant="ghost" onClick={() => load()} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}



