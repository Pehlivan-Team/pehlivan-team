'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LikeButton({
  postId,
  initialCount,
  initiallyLiked = false,
}: {
  postId: string;
  initialCount: number;
  initiallyLiked?: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initiallyLiked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} disabled={loading}>
      {liked ? '💚' : '🤍'} {count}
    </Button>
  );
}



