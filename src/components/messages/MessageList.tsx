'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import MessageBubble from './MessageBubble'
import { MessageWithSender } from '@/types/messages'

interface MessageListProps {
    conversationId: string
    currentUserId: string
    onNewMessage?: (message: MessageWithSender) => void
}

export default function MessageList({ conversationId, currentUserId }: MessageListProps) {
    const [messages, setMessages] = useState<MessageWithSender[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMoreOlder, setHasMoreOlder] = useState(true)
    const [oldestCursor, setOldestCursor] = useState<string | null>(null)

    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
    const [lastMessageId, setLastMessageId] = useState<string | null>(null)
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            // Always scroll to bottom, regardless of shouldScrollToBottom for initial load
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [])

    useEffect(() => {
        if (conversationId) {
            loadMessages(true)
        }
    }, [conversationId])

    // Only scroll to bottom on initial load and when user is near bottom
    useEffect(() => {
        if (shouldScrollToBottom && messages.length > 0 && messagesContainerRef.current) {
            const container = messagesContainerRef.current
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

            // Always scroll on initial load, or only if user is near bottom for new messages
            if (isAtBottom || loading) {
                // Immediate scroll
                container.scrollTop = container.scrollHeight

                // Additional scroll after DOM updates
                setTimeout(() => {
                    if (container.parentElement) {
                        container.scrollTop = container.scrollHeight
                    }
                }, 100)
            }
        }
    }, [messages.length, shouldScrollToBottom, loading])

    // Polling effect for real-time messages
    useEffect(() => {
        if (!conversationId) return

        const pollForNewMessages = async () => {
            try {
                // Only fetch the latest 10 messages for polling
                const response = await fetch(`/api/messages/conversations/${conversationId}?limit=10`)
                if (response.ok) {
                    const data = await response.json()
                    const newMessages = data.messages || []

                    if (newMessages.length > 0) {
                        const newestMessage = newMessages[newMessages.length - 1]

                        // Only update if we have new messages
                        if (!lastMessageId || newestMessage.id !== lastMessageId) {
                            // Filter out messages we already have - be more careful
                            const unprocessedMessages = newMessages.filter((msg: MessageWithSender) => {
                                return !messages.some(existingMsg => existingMsg.id === msg.id)
                            })

                            if (unprocessedMessages.length > 0) {
                                setMessages(prev => {
                                    // Add new messages to the end, maintain order
                                    const combined = [...prev, ...unprocessedMessages]
                                    // Remove duplicates more carefully
                                    const uniqueMessages = combined.filter((msg, index) => {
                                        const firstIndex = combined.findIndex(m => m.id === msg.id)
                                        return firstIndex === index
                                    })
                                    return uniqueMessages
                                })
                                setShouldScrollToBottom(true)
                            }
                        }

                        setLastMessageId(newestMessage.id)
                    }
                }
            } catch (error: any) {
                console.error('Error polling for messages:', error)

                // If quota exceeded, stop polling temporarily
                if (error.message?.includes('quota') || error.message?.includes('QUOTA_EXCEEDED')) {
                    console.log('Quota exceeded, stopping polling for 5 minutes')
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current)
                        pollingIntervalRef.current = null
                    }

                    // Resume polling after 5 minutes
                    setTimeout(() => {
                        if (conversationId) {
                            pollingIntervalRef.current = setInterval(pollForNewMessages, 10000)
                        }
                    }, 5 * 60 * 1000)
                }
            }
        }

        // Start polling every 10 seconds (reduced from 2 to save quota)
        pollingIntervalRef.current = setInterval(pollForNewMessages, 10000)

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }
        }
    }, [conversationId, messages, lastMessageId])

    const loadMessages = async (isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true)
                setMessages([])
                setOldestCursor(null)
                setShouldScrollToBottom(true)
            }
            // Don't set loadingMore here as it's handled in scroll handler

            setError(null)

            const url = new URL(`/api/messages/conversations/${conversationId}`, window.location.origin)
            url.searchParams.set('limit', isInitial ? '50' : '20') // Load more to avoid gaps

            // For loading older messages, use the oldest cursor
            if (!isInitial && oldestCursor) {
                url.searchParams.set('cursor', oldestCursor)
            }

            const response = await fetch(url.toString())
            if (!response.ok) {
                throw new Error('Failed to load messages')
            }

            const data = await response.json()
            const newMessages = data.messages || []

            if (isInitial) {
                setMessages(newMessages)
                // Set the last message ID for polling
                if (newMessages.length > 0) {
                    setLastMessageId(newMessages[newMessages.length - 1].id)
                    // Set cursor to the oldest message for future pagination
                    setOldestCursor(newMessages[0].timestamp)
                }
                // Always scroll to bottom on initial load
                setShouldScrollToBottom(true)

                // Multiple scroll attempts to ensure it works on initial load
                requestAnimationFrame(() => {
                    if (messagesContainerRef.current) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
                    }
                })

                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
                    }
                }, 100)

                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
                    }
                }, 300)
            } else {
                // Prepend older messages (they come in oldest-first order)
                setMessages(prev => {
                    const combined = [...newMessages, ...prev]
                    return combined
                })
                // Don't auto-scroll when loading older messages
                setShouldScrollToBottom(false)
                // Update cursor to the oldest message we just loaded
                if (newMessages.length > 0) {
                    setOldestCursor(newMessages[0].timestamp)
                }
            }

            setHasMoreOlder(data.hasMore)

            // Mark messages as read
            await markMessagesAsRead()
        } catch (err: any) {
            console.error('Error loading messages:', err)

            // Handle quota errors specifically
            if (err.message?.includes('quota') || err.message?.includes('QUOTA_EXCEEDED') || err.message?.includes('Service temporarily unavailable')) {
                setError('Service temporarily unavailable due to quota limits. Please try again later.')
            } else {
                setError(err.message)
            }
        } finally {
            setLoading(false)
            setLoadingMore(false)

            // Ensure scroll to bottom after loading completes (especially initial load)
            if (isInitial) {
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
                    }
                }, 500)
            }
        }
    }

    const markMessagesAsRead = async () => {
        try {
            await fetch(`/api/messages/conversations/${conversationId}`, {
                method: 'PATCH'
            })
        } catch (err) {
            console.error('Error marking messages as read:', err)
        }
    }

    // Function to add optimistic message before server confirmation
    const addOptimisticMessage = useCallback((content: string, senderId: string) => {
        const optimisticMessage: MessageWithSender = {
            id: `temp-${Date.now()}`,
            content,
            senderId,
            conversationId,
            timestamp: new Date().toISOString(),
            type: 'text',
            status: 'sent',
            senderUsername: 'You',
            senderName: 'You',
            senderProfilePicture: undefined
        }

        setMessages(prev => [...prev, optimisticMessage])
        setShouldScrollToBottom(true)
        return optimisticMessage.id
    }, [conversationId])

    // Function to replace optimistic message with real one
    const replaceOptimisticMessage = useCallback((tempId: string, realMessage: MessageWithSender) => {
        setMessages(prev => prev.map(msg =>
            msg.id === tempId ? realMessage : msg
        ))
    }, [])

    // Expose functions to parent
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).addOptimisticMessage = addOptimisticMessage;
            (window as any).replaceOptimisticMessage = replaceOptimisticMessage;
        }
    }, [addOptimisticMessage, replaceOptimisticMessage])

    const handleScroll = () => {
        if (!messagesContainerRef.current || loadingMore) return

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current

        // Load older messages when scrolling near the top (traditional chat behavior)
        if (scrollTop < 50 && hasMoreOlder) {
            setLoadingMore(true)
            // Disable auto-scroll when loading older messages
            setShouldScrollToBottom(false)
            const previousScrollHeight = scrollHeight

            loadMessages(false).then(() => {
                // Maintain scroll position after loading older messages
                setTimeout(() => {
                    if (messagesContainerRef.current) {
                        const newScrollHeight = messagesContainerRef.current.scrollHeight
                        const heightDifference = newScrollHeight - previousScrollHeight
                        messagesContainerRef.current.scrollTop = scrollTop + heightDifference
                    }
                }, 50)
            })
        }

        // Determine if user is near the bottom for auto-scroll to new messages
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
        setShouldScrollToBottom(isNearBottom)
    }

    const shouldShowAvatar = (message: MessageWithSender, index: number): boolean => {
        if (index === messages.length - 1) return true

        const nextMessage = messages[index + 1]
        return nextMessage.senderId !== message.senderId ||
            (new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime()) > 5 * 60 * 1000 // 5 minutes
    }

    if (loading) {
        return (
            <div className="h-0 flex-1 flex items-center justify-center bg-slate-950/30">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Mesajlar yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-0 flex-1 flex items-center justify-center bg-slate-950/30">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <h3 className="text-slate-200 font-medium mb-2">Mesajlar yüklenemedi</h3>
                    <p className="text-slate-400 text-sm mb-4">{error}</p>
                    <Button
                        onClick={() => loadMessages(true)}
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Tekrar Dene
                    </Button>
                </div>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="h-0 flex-1 flex items-center justify-center bg-slate-950/30">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-slate-200 font-medium mb-2">Henüz mesaj yok</h3>
                    <p className="text-slate-400 text-sm">
                        İlk mesajı göndererek konuşmayı başlatın.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-10 flex-1 flex flex-col bg-slate-950/30">
            {/* Messages container */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1 w-full"
            >
                {/* Load more older messages indicator at top */}
                {loadingMore && (
                    <div className="text-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mx-auto" />
                        <p className="text-xs text-slate-400 mt-2">Eski mesajlar yükleniyor...</p>
                    </div>
                )}

                {/* Show indicator when no more older messages */}
                {!hasMoreOlder && messages.length > 5 && (
                    <div className="text-center py-3">
                        <p className="text-xs text-slate-500">Konuşmanın başlangıcı</p>
                    </div>
                )}

                {/* Messages */}
                {messages.map((message, index) => {
                    const isOwn = message.senderId === currentUserId
                    const showAvatar = shouldShowAvatar(message, index)

                    return (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={isOwn}
                            showAvatar={showAvatar}
                        />
                    )
                })}
            </div>
        </div>
    )
}