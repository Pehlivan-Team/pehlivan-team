import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Store user's public key
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { publicKey } = await req.json()
    if (!publicKey) {
      return NextResponse.json({ error: 'Public key is required' }, { status: 400 })
    }

    const userId = session.user.id
    const keyRef = firestoreAdmin.collection('userKeys').doc(userId)

    await keyRef.set({
      userId,
      publicKey,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing public key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get current user's public key
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const keyDoc = await firestoreAdmin.collection('userKeys').doc(userId).get()

    if (!keyDoc.exists) {
      return NextResponse.json({ error: 'Public key not found' }, { status: 404 })
    }

    const data = keyDoc.data()
    return NextResponse.json({ publicKey: data?.publicKey })
  } catch (error) {
    console.error('Error getting public key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}