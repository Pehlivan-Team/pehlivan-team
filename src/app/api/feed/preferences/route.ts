import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Shape of preferences we support. Extend safely later.
const DEFAULT_PREFERENCES = {
  algorithm: 'latest', // 'latest' | 'popular'
  showProjects: true,
  showTeams: true,
  showCars: true,
  hideSponsored: false,
  language: 'tr', // 'tr' | 'en'
}

function sanitize(input: any) {
  if (!input || typeof input !== 'object') return DEFAULT_PREFERENCES
  return {
    algorithm: ['latest', 'popular'].includes(input.algorithm)
      ? input.algorithm
      : DEFAULT_PREFERENCES.algorithm,
    showProjects:
      typeof input.showProjects === 'boolean'
        ? input.showProjects
        : DEFAULT_PREFERENCES.showProjects,
    showTeams:
      typeof input.showTeams === 'boolean' ? input.showTeams : DEFAULT_PREFERENCES.showTeams,
    showCars: typeof input.showCars === 'boolean' ? input.showCars : DEFAULT_PREFERENCES.showCars,
    hideSponsored:
      typeof input.hideSponsored === 'boolean'
        ? input.hideSponsored
        : DEFAULT_PREFERENCES.hideSponsored,
    language: ['tr', 'en'].includes(input.language) ? input.language : DEFAULT_PREFERENCES.language,
  }
}

export async function GET() {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const username = session.user.username
  const q = await firestoreAdmin
    .collection('users')
    .where('username', '==', username)
    .limit(1)
    .get()
  if (q.empty) {
    return NextResponse.json({ preferences: DEFAULT_PREFERENCES })
  }
  const data: any = q.docs[0].data()
  const prefs = sanitize(data.feedPreferences)
  return NextResponse.json({ preferences: prefs })
}

export async function PATCH(req: Request) {
  const session: any = await getServerSession(authOptions as any)
  if (!session?.user?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json().catch(() => ({}))
  const incoming = sanitize(body)
  const username = session.user.username
  const q = await firestoreAdmin
    .collection('users')
    .where('username', '==', username)
    .limit(1)
    .get()
  if (q.empty) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const ref = q.docs[0].ref
  await ref.update({ feedPreferences: incoming })
  return NextResponse.json({ preferences: incoming })
}
