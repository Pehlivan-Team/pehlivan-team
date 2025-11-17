import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Get another user's public key
export async function GET(
  req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const targetUserId = resolvedParams.userId

    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const keyDoc = await firestoreAdmin.collection('userKeys').doc(targetUserId).get()

    if (!keyDoc.exists) {
      return NextResponse.json({ error: 'Public key not found for user' }, { status: 404 })
    }

    const data = keyDoc.data()
    return NextResponse.json({ 
      publicKey: data?.publicKey,
      userId: targetUserId 
    })
  } catch (error) {
    console.error('Error getting user public key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}