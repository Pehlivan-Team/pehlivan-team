import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import admin from 'firebase-admin'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { SendMessageRequest } from '@/types/messages'

// Simple in-memory cache for user data
const userCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCachedUser(userId: string) {
  const cached = userCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedUser(userId: string, data: any) {
  userCache.set(userId, { data, timestamp: Date.now() })
}

// Get messages for a conversation
export async function GET(
  req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const conversationId = resolvedParams.conversationId

    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const cursor = searchParams.get('cursor')

    // Verify user is participant in this conversation
    const participantDoc = await firestoreAdmin
      .collection('conversationParticipants')
      .where('conversationId', '==', conversationId)
      .where('userId', '==', userId)
      .limit(1)
      .get()

    if (participantDoc.empty) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build messages query
    let messagesQuery = firestoreAdmin
      .collection('messages')
      .where('conversationId', '==', conversationId)
      .limit(limit + 1)

    // If cursor is provided, use it for pagination (going backwards in time)
    if (cursor) {
      const cursorDate = new Date(cursor)
      // Use <= instead of < to ensure we don't skip messages with same timestamp
      messagesQuery = messagesQuery.where('timestamp', '<=', admin.firestore.Timestamp.fromDate(cursorDate))
    }

    const messagesSnapshot = await messagesQuery.get()
    let docs = messagesSnapshot.docs
    
    // If we have a cursor, we need to exclude the message with that exact timestamp to avoid duplicates
    if (cursor) {
      const cursorTime = new Date(cursor).getTime()
      docs = docs.filter(doc => {
        const docTime = doc.data().timestamp?.toDate?.()?.getTime() || 0
        return docTime < cursorTime
      })
    }
    
    // Sort by timestamp on server-side (descending - newest first)
    docs.sort((a, b) => {
      const aTime = a.data().timestamp?.toDate?.() || new Date(0)
      const bTime = b.data().timestamp?.toDate?.() || new Date(0)
      return bTime.getTime() - aTime.getTime()
    })

    const hasMore = docs.length > limit
    const messageDocs = hasMore ? docs.slice(0, limit) : docs

    const messages = []
    
    for (const messageDoc of messageDocs) {
      const messageData = messageDoc.data()
      
      // Get sender details
      const senderDoc = await firestoreAdmin
        .collection('users')
        .doc(messageData.senderId)
        .get()
        
      const senderData = senderDoc.exists ? senderDoc.data() : null

      messages.push({
        id: messageDoc.id,
        ...messageData,
        timestamp: messageData.timestamp?.toDate?.() || new Date(),
        senderName: senderData?.name || senderData?.username || 'Unknown',
        senderProfilePicture: senderData?.profilePictureUrl || senderData?.image
      })
    }

    const nextCursor = hasMore && messageDocs.length > 0
      ? messageDocs[messageDocs.length - 1].data().timestamp.toDate().toISOString()
      : null

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order (oldest to newest for display)
      nextCursor,
      hasMore
    })
  } catch (error: any) {
    console.error('Error getting messages:', error)
    
    // Handle quota exhausted errors
    if (error.code === 8 || error.message?.includes('Quota exceeded')) {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable. Please try again in a few minutes.',
        code: 'QUOTA_EXCEEDED'
      }, { status: 503 })
    }
    
    // Handle other rate limit errors
    if (error.code === 14 || error.message?.includes('UNAVAILABLE')) {
      return NextResponse.json({ 
        error: 'Service temporarily busy. Please try again shortly.',
        code: 'SERVICE_UNAVAILABLE'
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Send new message
export async function POST(
  req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const conversationId = resolvedParams.conversationId

    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id || !session?.user?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const username = session.user.username
    const body: SendMessageRequest = await req.json()

    const { content, type = 'text' } = body

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    // Verify user is participant in this conversation
    const participantDoc = await firestoreAdmin
      .collection('conversationParticipants')
      .where('conversationId', '==', conversationId)
      .where('userId', '==', userId)
      .limit(1)
      .get()

    if (participantDoc.empty) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create message
    const messageRef = firestoreAdmin.collection('messages').doc()
    const now = new Date()

    const messageData = {
      conversationId,
      senderId: userId,
      senderUsername: username,
      content,
      timestamp: now,
      type,
      status: 'sent'
    }

    // Update conversation's last message time and content preview
    const conversationRef = firestoreAdmin.collection('conversations').doc(conversationId)

    await firestoreAdmin.runTransaction(async (transaction) => {
      transaction.set(messageRef, messageData)
      transaction.update(conversationRef, {
        lastMessageAt: now,
        lastMessage: content.substring(0, 100), // Text preview
        updatedAt: now
      })
    })

    return NextResponse.json({
      message: {
        id: messageRef.id,
        ...messageData
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Mark messages as read
export async function PATCH(
  req: NextRequest,
  context: { params: any }
): Promise<NextResponse> {
  try {
    const params = context.params
    const resolvedParams: any = await params
    const conversationId = resolvedParams.conversationId

    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Update user's last read time for this conversation
    const participantQuery = await firestoreAdmin
      .collection('conversationParticipants')
      .where('conversationId', '==', conversationId)
      .where('userId', '==', userId)
      .limit(1)
      .get()

    if (participantQuery.empty) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const participantDoc = participantQuery.docs[0]
    await participantDoc.ref.update({
      lastReadAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}