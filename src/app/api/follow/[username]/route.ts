import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Collection: follows (doc id: followerUsername + '::' + targetUsername)
// Each doc: { follower: string, target: string, createdAt: Timestamp }

async function getCounts(target: string) {
  const followsRef = firestoreAdmin.collection('follows')
  const followersSnap = await followsRef.where('target', '==', target).get()
  const followingSnap = await followsRef.where('follower', '==', target).get()
  return { followersCount: followersSnap.size, followingCount: followingSnap.size }
}

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const session: any = await getServerSession(authOptions as any)
  const viewer = session?.user?.username
  const target = params.username
  if (!target) return NextResponse.json({ error: 'username required' }, { status: 400 })

  const followsRef = firestoreAdmin.collection('follows')
  let isFollowing = false
  if (viewer) {
    const docId = `${viewer}::${target}`
    const doc = await followsRef.doc(docId).get()
    isFollowing = doc.exists
  }
  const counts = await getCounts(target)
  return NextResponse.json({ ...counts, isFollowing })
}

export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
  const session: any = await getServerSession(authOptions as any)
  const follower = session?.user?.username
  const target = params.username
  if (!follower) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (follower === target)
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })

  const followsRef = firestoreAdmin.collection('follows')
  const docId = `${follower}::${target}`
  const existing = await followsRef.doc(docId).get()
  if (existing.exists) {
    return NextResponse.json({ message: 'Already following' }, { status: 200 })
  }
  await followsRef.doc(docId).set({ follower, target, createdAt: new Date() })
  const counts = await getCounts(target)
  return NextResponse.json({ message: 'Followed', ...counts, isFollowing: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { username: string } }) {
  const session: any = await getServerSession(authOptions as any)
  const follower = session?.user?.username
  const target = params.username
  if (!follower) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (follower === target)
    return NextResponse.json({ error: 'Cannot unfollow yourself' }, { status: 400 })
  const followsRef = firestoreAdmin.collection('follows')
  const docId = `${follower}::${target}`
  await followsRef.doc(docId).delete()
  const counts = await getCounts(target)
  return NextResponse.json({ message: 'Unfollowed', ...counts, isFollowing: false })
}
