import admin from 'firebase-admin'
import { getServerSession } from 'next-auth'

import LazyFeed from '@/components/feed/LazyFeed'
import FloatingPostButton from '@/components/post/FloatingPostButton'
import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

export const revalidate = 30

async function getFeed(limit = 20) {
  const query = firestoreAdmin
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(limit)

  const snapshot = await query.get()
  const docs = snapshot.docs
  
  const posts = docs
    .map((d) => {
      const data: any = d.data()
      if (!data || typeof data.authorUsername !== 'string') return null
      
      return {
        id: d.id,
        authorUsername: data.authorUsername,
        authorId: data.authorId,
        content: data.content || '',
        imageUrl: data.imageUrl || undefined,
        imageUrls: data.imageUrls || undefined,
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        type: data.type || 'social',
        linkUrl: data.linkUrl || undefined,
        hashtags: data.hashtags || undefined,
        mentions: data.mentions || undefined,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }
    })
    .filter(Boolean) as any[]

  return posts
}

async function getCurrentUserProfile() {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.username) return null
  
  const q = await firestoreAdmin
    .collection('users')
    .where('username', '==', session.user.username)
    .limit(1)
    .get()
    
  if (q.empty) return null
  
  const data: any = q.docs[0].data()
  return {
    username: data.username || '',
    name: data.name || '',
    profilePictureUrl: data.profilePictureUrl || data.image || '',
    team: data.team || '',
    bio: data.bio || '',
  }
}

export default async function FeedPage() {
  const [posts] = await Promise.all([getFeed()])
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src="/tp-sosyal.svg"
            alt="Pehlivan Team Social"
            className="h-8 w-auto brightness-0 invert"
          />
          <h1 className="text-3xl font-bold text-white">TAS-PRO SOSYALLEŞ</h1>
        </div>
        <div className="text-sm text-slate-400">
          {posts.length} paylaşım yüklendi
        </div>
      </div>
      
      <LazyFeed initialPosts={posts} />
      <FloatingPostButton />
    </>
  )
}
