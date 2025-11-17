import { notFound } from 'next/navigation'

import { firestoreAdmin } from '@/lib/firebase-admin'

import PostDetailClient from '@/components/post/PostDetailClient'

type PostDetail = {
  id: string
  authorUsername: string
  content: string
  imageUrl?: string | null
  imageUrls?: string[] | null
  likeCount: number
  commentCount: number
  type?: string
  linkUrl?: string | null
  createdAtMillis?: number
}

export const revalidate = 30

async function getPost(id: string): Promise<PostDetail | null> {
  const doc = await firestoreAdmin.collection('posts').doc(id).get()
  if (!doc.exists) return null
  const data: any = doc.data()
  return {
    id: doc.id,
    authorUsername: data?.authorUsername || '',
    content: data?.content || '',
    imageUrl: data?.imageUrl || null,
    imageUrls: data?.imageUrls || null,
    likeCount: data?.likeCount || 0,
    commentCount: data?.commentCount || 0,
    type: data?.type || 'social',
    linkUrl: data?.linkUrl || null,
    createdAtMillis: data?.createdAt?.toMillis ? data.createdAt.toMillis() : undefined,
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return notFound()
  return <PostDetailClient post={post} />
}
