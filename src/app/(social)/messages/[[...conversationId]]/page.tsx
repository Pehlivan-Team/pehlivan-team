'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { MessageCircle, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MessageList from '@/components/messages/MessageList'
import MessageInput from '@/components/messages/MessageInput'
import ConversationSidebar from '@/components/messages/ConversationSidebar'
import { ConversationWithParticipants } from '@/types/messages'

export default function MessagesPage() {
    const params = useParams()
    const { data: session } = useSession()

    // Handle the catch-all route parameter - conversationId is an array for [[...conversationId]]
    const conversationIdArray = params?.conversationId as string[] | undefined
    const conversationId = conversationIdArray?.[0] // Get first element or undefined

    const [currentConversation, setCurrentConversation] = useState<ConversationWithParticipants | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (conversationId) {
            loadConversation()
        }
    }, [conversationId])

    const loadConversation = async () => {
        if (!conversationId) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            // Get conversation details from the conversations list API
            const response = await fetch('/api/messages/conversations')
            if (!response.ok) {
                throw new Error('Failed to load conversation')
            }

            const data = await response.json()
            const conversation = data.conversations?.find((c: any) => c.id === conversationId)

            if (!conversation) {
                setError('Conversation not found')
                return
            }

            setCurrentConversation(conversation)
        } catch (err: any) {
            console.error('Error loading conversation:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getConversationTitle = (conversation: ConversationWithParticipants): string => {
        if (conversation.type === 'group') {
            return conversation.name || 'İsimsiz Grup'
        }

        // For direct messages, show the other participant's name
        const currentUserId = session?.user?.id
        const otherParticipant = conversation.participantDetails.find(p =>
            p.userId !== currentUserId
        )

        return otherParticipant?.name || otherParticipant?.username || 'Bilinmeyen Kullanıcı'
    }

    if (!session) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-200 mb-2">Giriş Gerekli</h2>
                    <p className="text-slate-400 mb-4">Mesajlaşmak için giriş yapın</p>
                    <Button asChild>
                        <Link href="/auth/login">Giriş Yap</Link>
                    </Button>
                </div>
            </div>
        )
    }



    return (
        <div className=" bg-slate-950 flex">
            {/* Conversation Sidebar - hidden on mobile when conversation is selected */}
            <div className={`${conversationId ? 'hidden md:block' : 'block'}`}>
                <ConversationSidebar
                    currentConversationId={conversationId}
                />
            </div>

            {/* Main Chat Area - full width on mobile when conversation selected */}
            <div className={`flex flex-col h-screen overflow-hidden ${conversationId ? 'flex-1 h-[90vh]' : 'hidden md:flex md:flex-1 '
                }`}>
                {conversationId ? (
                    <>
                        {/* Chat Header */}
                        {currentConversation && (
                            <div className="border-b border-slate-700 bg-slate-900/50 p-4">
                                <div className="flex items-center gap-3">
                                    {/* Back button for mobile */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden h-8 w-8"
                                        asChild
                                    >
                                        <Link href="/messages">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    {/* Avatar */}
                                    <Avatar className="h-10 w-10 border border-slate-700">
                                        <AvatarImage
                                            src={
                                                currentConversation.type === 'direct'
                                                    ? currentConversation.participantDetails.find(p => p.userId !== session.user?.id)?.profilePictureUrl
                                                    : undefined
                                            }
                                        />
                                        <AvatarFallback className="bg-slate-800 text-slate-300">
                                            {currentConversation.type === 'group' ? (
                                                <Users className="h-5 w-5" />
                                            ) : (
                                                getConversationTitle(currentConversation)[0]?.toUpperCase() || 'U'
                                            )}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Conversation info */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-slate-200 truncate">
                                            {getConversationTitle(currentConversation)}
                                        </h2>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            {currentConversation.type === 'group' && (
                                                <>
                                                    <span>{currentConversation.participantDetails.length} üye</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageCircle className="h-8 w-8 animate-pulse text-emerald-500 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Konuşma yükleniyor...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-red-400 mb-2">{error}</p>
                                    <Button
                                        onClick={loadConversation}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Tekrar Dene
                                    </Button>
                                </div>
                            </div>
                        ) : currentConversation ? (
                            <>
                                <MessageList
                                    conversationId={conversationId}
                                    currentUserId={session.user?.id || ''}
                                />

                                <MessageInput
                                    conversationId={conversationId}
                                    currentUserId={session.user?.id}
                                />
                            </>
                        ) : null}
                    </>
                ) : (
                    // No conversation selected - only show on desktop
                    <div className="hidden md:flex flex-1 items-center justify-center">
                        <div className="text-center max-w-md mx-auto">
                            <MessageCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">
                                Mesajlaşmaya Hoş Geldiniz
                            </h3>
                            <p className="text-slate-400 mb-4">
                                Sol taraftaki listeden bir konuşma seçin veya yeni bir sohbet başlatın.
                                Mesajlarınız güvenli bir şekilde iletilir.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}