import { NextRequest, NextResponse } from 'next/server'

import { firestoreAdmin } from '@/lib/firebase-admin'

export async function GET(req: NextRequest, context: { params: any }) {
  const params = context.params
  const resolvedParams: any = await params
  const { username } = resolvedParams
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })

  const followsRef = firestoreAdmin.collection('follows')
  const snap = await followsRef.where('follower', '==', username).get()
  const targetUsernames = snap.docs.map((d) => d.data().target as string)
  if (targetUsernames.length === 0) return NextResponse.json({ users: [] })

  const usersRef = firestoreAdmin.collection('users')
  const results: any[] = []
  for (const u of targetUsernames) {
    const q = await usersRef.where('username', '==', u).limit(1).get()
    if (!q.empty) {
      const doc = q.docs[0].data()
      results.push({
        username: doc.username,
        name: doc.name || doc.username,
        profilePictureUrl: doc.profilePictureUrl || doc.image || '',
      })
    }
  }
  return NextResponse.json({ users: results })
}
