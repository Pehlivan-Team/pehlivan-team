'use client'

import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { MessageCircle, Users, Lock, Search, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ConversationWithParticipants } from '@/types/messages'

interface ConversationSidebarProps {
    currentConversationId?: string
    onConversationSelect?: (conversationId: string) => void
}

export default function ConversationSidebar({
    currentConversationId,
    onConversationSelect
}: ConversationSidebarProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [conversations, setConversations] = useState<ConversationWithParticipants[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadConversations()
    }, [])

    const loadConversations = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/messages/conversations')
            if (!response.ok) {
                throw new Error('Failed to load conversations')
            }

            const data = await response.json()
            setConversations(data.conversations || [])
        } catch (err: any) {
            console.error('Error loading conversations:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery.trim()) return true

        const query = searchQuery.toLowerCase()

        // Search in conversation name (for groups)
        if (conv.name && conv.name.toLowerCase().includes(query)) {
            return true
        }

        // Search in participant names
        return conv.participantDetails.some(participant =>
            participant.name.toLowerCase().includes(query) ||
            participant.username.toLowerCase().includes(query)
        )
    })

    const getConversationTitle = (conversation: ConversationWithParticipants): string => {
        if (conversation.type === 'group') {
            return conversation.name || 'İsimsiz Grup'
        }

        // For direct messages, show the other participant's name (not current user)
        const currentUserId = session?.user?.id
        const currentUsername = session?.user?.username
        const currentName = session?.user?.name
        
        // Find the participant that is NOT the current user
        // Try multiple matching strategies
        let otherParticipant = conversation.participantDetails.find(p => {
            // Strategy 1: Match by userId
            if (currentUserId && p.userId === currentUserId) {
                return false // This is the current user, skip
            }
            
            // Strategy 2: Match by username
            if (currentUsername && p.username === currentUsername) {
                return false // This is the current user, skip
            }
            
            // Strategy 3: Match by name
            if (currentName && p.name === currentName) {
                return false // This is the current user, skip
            }
            
            return true // This is the other participant
        })
        
        // If we have exactly 2 participants and couldn't find other, take the second one
        if (!otherParticipant && conversation.participantDetails.length === 2) {
            otherParticipant = conversation.participantDetails[1]
        }
        
        // Final fallback
        if (!otherParticipant) {
            otherParticipant = conversation.participantDetails[0]
        }

        return otherParticipant?.name || otherParticipant?.username || 'Bilinmeyen Kullanıcı'
    }

    const getConversationAvatar = (conversation: ConversationWithParticipants) => {
        if (conversation.type === 'group') {
            return null // Group avatar
        }

        const currentUserId = session?.user?.id
        const currentUsername = session?.user?.username
        const currentName = session?.user?.name
        
        // Find the participant that is NOT the current user
        let otherParticipant = conversation.participantDetails.find(p => {
            // Skip if this is the current user
            if (currentUserId && p.userId === currentUserId) return false
            if (currentUsername && p.username === currentUsername) return false
            if (currentName && p.name === currentName) return false
            return true
        })
        
        // Fallback strategies
        if (!otherParticipant && conversation.participantDetails.length === 2) {
            otherParticipant = conversation.participantDetails[1]
        }
        
        if (!otherParticipant) {
            otherParticipant = conversation.participantDetails[0]
        }

        return otherParticipant?.profilePictureUrl
    }

    const getLastMessagePreview = (conversation: ConversationWithParticipants): string => {
        if (!conversation.lastMessage) return 'Mesaj yok'

        // lastMessage is already a string preview
        const content = conversation.lastMessage
        
        // Limit length for preview
        if (content.length > 50) {
            return content.substring(0, 50) + '...'
        }
        
        return content || 'Mesaj'
    }

    const handleConversationClick = (conversationId: string) => {
        onConversationSelect?.(conversationId)
        router.push(`/messages/${conversationId}`)
    }

    const handleNewChat = () => {
        router.push('/messages/new')
    }

    if (loading) {
        return (
            <div className="w-80 border-r border-slate-700 bg-slate-900/50 h-screen flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-80 border-r border-slate-700 bg-slate-900/50 h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Mesajlar
                    </h1>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNewChat}
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Konuşmalarda ara..."
                        className="
              pl-10 bg-slate-800/60 border-slate-700 text-slate-100 
              placeholder:text-slate-500 focus:border-emerald-600
            "
                    />
                </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {error && (
                    <div className="p-4 text-center text-red-400 text-sm">
                        Hata: {error}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadConversations}
                            className="mt-2 text-emerald-400"
                        >
                            Tekrar Dene
                        </Button>
                    </div>
                )}

                {!error && filteredConversations.length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm mb-2">
                            {searchQuery ? 'Konuşma bulunamadı' : 'Henüz mesaj yok'}
                        </p>
                        {!searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleNewChat}
                                className="text-emerald-400 hover:text-emerald-300"
                            >
                                İlk mesajını gönder
                            </Button>
                        )}
                    </div>
                )}

                {filteredConversations.map((conversation) => {
                    const isActive = conversation.id === currentConversationId
                    const title = getConversationTitle(conversation)
                    const avatar = getConversationAvatar(conversation)
                    const lastMessagePreview = getLastMessagePreview(conversation)
                    
                    const timeLabel = (() => {
                        try {
                            if (!conversation.lastMessageAt) return ''
                            
                            let date: Date;
                            if (conversation.lastMessageAt instanceof Date) {
                                date = conversation.lastMessageAt;
                            } else if (typeof conversation.lastMessageAt === 'string') {
                                date = new Date(conversation.lastMessageAt);
                            } else if (conversation.lastMessageAt && typeof conversation.lastMessageAt === 'object') {
                                // Handle Firestore Timestamp object or serialized timestamp
                                const timestampObj = conversation.lastMessageAt as any;
                                if ('toDate' in timestampObj && typeof timestampObj.toDate === 'function') {
                                    date = timestampObj.toDate();
                                } else if ('seconds' in timestampObj && 'nanoseconds' in timestampObj) {
                                    // Serialized Firestore timestamp
                                    date = new Date(timestampObj.seconds * 1000 + Math.floor(timestampObj.nanoseconds / 1000000));
                                } else if ('_seconds' in timestampObj && '_nanoseconds' in timestampObj) {
                                    // Alternative serialized format
                                    date = new Date(timestampObj._seconds * 1000 + Math.floor(timestampObj._nanoseconds / 1000000));
                                } else {
                                    console.error('Invalid lastMessageAt format:', conversation.lastMessageAt);
                                    return '';
                                }
                            } else {
                                console.error('Invalid lastMessageAt format:', conversation.lastMessageAt);
                                return '';
                            }

                            // Check if date is valid
                            if (isNaN(date.getTime())) {
                                console.error('Invalid lastMessageAt date:', conversation.lastMessageAt);
                                return '';
                            }

                            return formatDistanceToNow(date, { addSuffix: true, locale: tr });
                        } catch (error) {
                            console.error('Error formatting lastMessageAt:', error, 'Original timestamp:', conversation.lastMessageAt);
                            return '';
                        }
                    })()

                    return (
                        <button
                            key={conversation.id}
                            onClick={() => handleConversationClick(conversation.id)}
                            className={`
                w-full p-3 flex items-center gap-3 hover:bg-slate-800/50 
                transition-colors border-l-2 text-left
                ${isActive
                                    ? 'bg-slate-800/70 border-l-emerald-500'
                                    : 'border-l-transparent'
                                }
              `}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <Avatar className="h-12 w-12 border border-slate-700">
                                    <AvatarImage src={avatar || undefined} />
                                    <AvatarFallback className="bg-slate-800 text-slate-300">
                                        {conversation.type === 'group' ? (
                                            <Users className="h-6 w-6" />
                                        ) : (
                                            title[0]?.toUpperCase() || 'U'
                                        )}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Unread badge */}
                                {conversation.unreadCount > 0 && (
                                    <div className="
                    absolute -top-1 -right-1 bg-emerald-500 text-white 
                    text-xs rounded-full h-5 w-5 flex items-center justify-center
                    font-semibold
                  ">
                                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                                    </div>
                                )}
                            </div>

                            {/* Conversation info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-medium text-slate-200 truncate">
                                        {title}
                                    </h3>

                                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                                        <Lock className="h-3 w-3" />
                                        {timeLabel && <span>{timeLabel}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-slate-400 truncate flex-1">
                                        {lastMessagePreview}
                                    </p>

                                    {conversation.type === 'group' && (
                                        <Users className="h-3 w-3 text-slate-500 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}