import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import admin from 'firebase-admin'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'
import { CreateConversationRequest } from '@/types/messages'

// Simple in-memory cache for user data (expires after 5 minutes)
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

// Clean up expired cache entries
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of userCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      userCache.delete(key)
    }
  }
}, CACHE_TTL)

// Get user's conversations
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get conversations where user is a participant
    const participantsQuery = await firestoreAdmin
      .collection('conversationParticipants')
      .where('userId', '==', userId)
      .get()

    if (participantsQuery.empty) {
      return NextResponse.json({ conversations: [] })
    }

    const conversationIds = participantsQuery.docs.map(doc => doc.data().conversationId)

    // Get conversation details
    const conversationsQuery = await firestoreAdmin
      .collection('conversations')
      .where(admin.firestore.FieldPath.documentId(), 'in', conversationIds)
      .orderBy('updatedAt', 'desc')
      .get()

    const conversations = []
    
    for (const conversationDoc of conversationsQuery.docs) {
      const conversationData = conversationDoc.data()
      
      // Get all participants for this conversation
      const participantsQuery = await firestoreAdmin
        .collection('conversationParticipants')
        .where('conversationId', '==', conversationDoc.id)
        .get()

      // Get participant details with batch processing and caching
      const participantDetails = []
      const uncachedUserIds = []
      const cachedUsers = new Map()
      
      // Check cache first
      for (const participantDoc of participantsQuery.docs) {
        const participantData = participantDoc.data()
        const cached = getCachedUser(participantData.userId)
        if (cached) {
          cachedUsers.set(participantData.userId, cached)
        } else {
          uncachedUserIds.push(participantData.userId)
        }
      }
      
      // Batch fetch uncached users
      const batchedUsers = new Map()
      if (uncachedUserIds.length > 0) {
        // Process in chunks of 10 (Firestore 'in' query limit)
        const chunks = []
        for (let i = 0; i < uncachedUserIds.length; i += 10) {
          chunks.push(uncachedUserIds.slice(i, i + 10))
        }
        
        for (const chunk of chunks) {
          const usersQuery = await firestoreAdmin
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
            .get()
          
          usersQuery.docs.forEach(doc => {
            const userData = doc.data()
            batchedUsers.set(doc.id, userData)
            setCachedUser(doc.id, userData)
          })
        }
      }
      
      // Build participant details
      for (const participantDoc of participantsQuery.docs) {
        const participantData = participantDoc.data()
        const userData = cachedUsers.get(participantData.userId) || batchedUsers.get(participantData.userId)
        
        participantDetails.push({
          userId: participantData.userId,
          username: userData?.username || 'Unknown',
          name: userData?.name || userData?.username || 'Unknown',
          profilePictureUrl: userData?.profilePictureUrl || userData?.image,
          role: participantData.role,
          lastReadAt: participantData.lastReadAt
        })
      }

      // Count unread messages - temporarily disabled due to index requirements
      const currentUserParticipant = participantsQuery.docs.find(
        doc => doc.data().userId === userId
      )
      const lastReadAt = currentUserParticipant?.data().lastReadAt

      let unreadCount = 0
      // TODO: Re-enable after creating proper Firestore indexes
      // if (lastReadAt) {
      //   const unreadQuery = await firestoreAdmin
      //     .collection('messages')
      //     .where('conversationId', '==', conversationDoc.id)
      //     .where('timestamp', '>', lastReadAt)
      //     .where('senderId', '!=', userId)
      //     .get()
      //   
      //   unreadCount = unreadQuery.size
      // }

      // Serialize Firestore timestamps to proper format
      const serializedConversationData = {
        ...conversationData,
        lastMessageAt: conversationData.lastMessageAt ? 
          (conversationData.lastMessageAt.toDate ? conversationData.lastMessageAt.toDate().toISOString() : conversationData.lastMessageAt) 
          : null,
        createdAt: conversationData.createdAt ? 
          (conversationData.createdAt.toDate ? conversationData.createdAt.toDate().toISOString() : conversationData.createdAt) 
          : null,
        updatedAt: conversationData.updatedAt ? 
          (conversationData.updatedAt.toDate ? conversationData.updatedAt.toDate().toISOString() : conversationData.updatedAt) 
          : null,
      }

      conversations.push({
        id: conversationDoc.id,
        ...serializedConversationData,
        participantDetails,
        unreadCount
      })
    }

    return NextResponse.json({ conversations })
  } catch (error: any) {
    console.error('Error getting conversations:', error)
    
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

// Create new conversation
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body: CreateConversationRequest = await req.json()

    const { type, participantIds, name } = body

    if (!type || !participantIds || participantIds.length === 0) {
      return NextResponse.json({ error: 'Type and participants are required' }, { status: 400 })
    }

    if (type === 'group' && !name) {
      return NextResponse.json({ error: 'Name is required for group conversations' }, { status: 400 })
    }

    // For direct conversations, ensure only 2 participants
    if (type === 'direct' && participantIds.length !== 1) {
      return NextResponse.json({ error: 'Direct conversations must have exactly 1 other participant' }, { status: 400 })
    }

    // Add current user to participants if not already included
    const allParticipants = [...new Set([userId, ...participantIds])]

    // For direct conversations, check if conversation already exists
    if (type === 'direct') {
      const existingConversation = await findExistingDirectConversation(allParticipants)
      if (existingConversation) {
        return NextResponse.json({ 
          conversation: existingConversation,
          message: 'Conversation already exists'
        })
      }
    }

    // Create conversation
    const conversationRef = firestoreAdmin.collection('conversations').doc()
    const now = new Date()

    const conversationData: any = {
      type,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      participants: allParticipants
    }

    // Only add name field for group conversations
    if (type === 'group' && name) {
      conversationData.name = name
    }

    await conversationRef.set(conversationData)

    // Create participant records
    const batch = firestoreAdmin.batch()
    
    allParticipants.forEach((participantId, index) => {
      const participantRef = firestoreAdmin.collection('conversationParticipants').doc()
      batch.set(participantRef, {
        conversationId: conversationRef.id,
        userId: participantId,
        joinedAt: now,
        role: participantId === userId ? 'admin' : 'member'
      })
    })

    await batch.commit()

    return NextResponse.json({ 
      conversation: {
        id: conversationRef.id,
        ...conversationData
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to find existing direct conversation
async function findExistingDirectConversation(participantIds: string[]): Promise<any> {
  // Get all direct conversations
  const conversationsQuery = await firestoreAdmin
    .collection('conversations')
    .where('type', '==', 'direct')
    .get()

  for (const doc of conversationsQuery.docs) {
    const data = doc.data()
    const participants = data.participants || []
    
    // Check if participants match exactly
    if (participants.length === participantIds.length &&
        participants.every((id: string) => participantIds.includes(id))) {
      return {
        id: doc.id,
        ...data
      }
    }
  }

  return null
}