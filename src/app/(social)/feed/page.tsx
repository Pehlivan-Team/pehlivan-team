import admin from 'firebase-admin'
import { getServerSession } from 'next-auth'

import FeedSearchBox from '@/components/feed/FeedSearchBox'
import FloatingPostButton from '@/components/post/FloatingPostButton'
import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

export const revalidate = 30

async function getFeed(limit = 30, cursor?: string) {
  let query = firestoreAdmin.collection('posts').orderBy('createdAt', 'desc').limit(limit)

  if (cursor) {
    const cursorTs = admin.firestore.Timestamp.fromDate(new Date(cursor))
    query = query.startAfter(cursorTs)
  }

  const snapshot = await query.get()
  const docs = snapshot.docs
  return docs
    .map((d) => {
      const data: any = d.data()
      if (!data || typeof data.authorUsername !== 'string') return null
      return {
        id: d.id,
        authorUsername: data.authorUsername,
        content: data.content || '',
        imageUrl: data.imageUrl || undefined,
        imageUrls: data.imageUrls || undefined,
        likeCount: data.likeCount || 0,
        commentCount: data.commentCount || 0,
        type: data.type || 'social',
        linkUrl: data.linkUrl || undefined,
      }
    })
    .filter(Boolean) as any[]
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
      <h1 className="text-3xl font-bold text-white mb-4">TAS-PRO SOSYALLEŞ</h1>
      <FeedSearchBox initialPosts={posts as any} />
      <FloatingPostButton />
    </>
  )
}
