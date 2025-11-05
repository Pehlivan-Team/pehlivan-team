'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import CommentComposer from './CommentComposer';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export default function PostCard({ post }: { post: any }) {
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        // users collection stores username; fetch profilePictureUrl
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', post.authorUsername), limit(1));
        const snap = await getDocs(q);
        if (!isMounted) return;
        if (!snap.empty) {
          const data: any = snap.docs[0].data();
          setProfilePic(data.profilePictureUrl || data.image || undefined);
        }
      } catch {}
    }
    if (post.authorUsername) loadProfile();
    return () => {
      isMounted = false;
    };
  }, [post.authorUsername]);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profilePic} />
          <AvatarFallback>{post.authorUsername?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <Link href={`/profile/${post.authorUsername}`} className="text-sm text-slate-200 hover:underline">
          @{post.authorUsername}
        </Link>
      </div>

      <p className="text-slate-100 whitespace-pre-wrap">{post.content}</p>
      {post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt="post image"
          className="mt-3 max-h-96 w-full object-cover rounded"
        />
      ) : null}
      <div className="mt-2 flex items-center gap-2">
        <LikeButton postId={post.id} initialCount={post.likeCount || 0} />
        <span className="text-sm text-slate-400">{post.commentCount || 0} comments</span>
      </div>
      <CommentComposer postId={post.id} />
      <CommentList postId={post.id} />
    </div>
  );
}


