export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name?: string // For group chats
  createdBy: string // User ID who created the conversation
  createdAt: Date
  updatedAt: Date
  lastMessageAt?: Date
  lastMessage?: string // Text preview
  participants: string[] // Array of user IDs
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderUsername: string
  content: string // Plain text message content
  timestamp: Date | string // Can be Date object or ISO string from API
  type: 'text' | 'image' | 'file'
  status: 'sent' | 'delivered' | 'read'
  editedAt?: Date | string
}

export interface ConversationParticipant {
  conversationId: string
  userId: string
  joinedAt: Date
  lastReadAt?: Date
  role: 'admin' | 'member' // For group chats
  nickname?: string
}

export interface UserKeys {
  userId: string
  publicKey: string // PEM format public key
  createdAt: Date
  updatedAt: Date
}

export interface CreateConversationRequest {
  type: 'direct' | 'group'
  participantIds: string[]
  name?: string // Required for group chats
}

export interface SendMessageRequest {
  conversationId: string
  content: string
  type?: 'text' | 'image' | 'file'
}

export interface ConversationWithParticipants extends Conversation {
  participantDetails: {
    userId: string
    username: string
    name: string
    profilePictureUrl?: string
    role: 'admin' | 'member'
    lastReadAt?: Date
  }[]
  unreadCount: number
}

export interface MessageWithSender extends Message {
  senderName: string
  senderProfilePicture?: string
}