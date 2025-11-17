'use client'

import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CheckCheck, Check } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageWithSender } from '@/types/messages'

interface MessageBubbleProps {
    message: MessageWithSender
    isOwn: boolean
    showAvatar: boolean
}

export default function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
    // Safeguard: Ensure message has required properties
    if (!message || !message.id) {
        console.error('Invalid message object:', message)
        return null
    }

    const timeLabel = (() => {
        try {
            let date: Date;
            if (message.timestamp instanceof Date) {
                date = message.timestamp;
            } else if (typeof message.timestamp === 'string') {
                date = new Date(message.timestamp);
            } else if (message.timestamp && typeof message.timestamp === 'object' && 'toDate' in message.timestamp) {
                // Firestore Timestamp object
                date = (message.timestamp as any).toDate();
            } else {
                console.error('Invalid timestamp format:', message.timestamp);
                return 'Bilinmeyen zaman';
            }

            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', message.timestamp);
                return 'Geçersiz tarih';
            }

            return formatDistanceToNow(date, {
                addSuffix: true,
                locale: tr
            });
        } catch (error) {
            console.error('Error formatting timestamp:', error, 'Original timestamp:', message.timestamp);
            return 'Zaman hatası';
        }
    })()

    const StatusIcon = () => {
        if (message.status === 'read') {
            return <CheckCheck className="h-3 w-3 text-emerald-500" />
        } else if (message.status === 'delivered') {
            return <CheckCheck className="h-3 w-3 text-slate-400" />
        } else {
            return <Check className="h-3 w-3 text-slate-400" />
        }
    }

    return (
        <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {showAvatar && !isOwn && (
                <Avatar className="h-8 w-8 border border-slate-700 flex-shrink-0">
                    <AvatarImage src={message.senderProfilePicture} />
                    <AvatarFallback className="text-xs bg-slate-800">
                        {message.senderName[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            )}

            {showAvatar && isOwn && <div className="w-8" />}

            {/* Message Content */}
            <div className={`max-w-[70%] min-w-0 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Sender name (for group chats when not own message) */}
                {!isOwn && showAvatar && (
                    <span className="text-xs text-slate-400 mb-1 px-1">
                        {message.senderName}
                    </span>
                )}

                {/* Message bubble */}
                <div
                    className={`
            rounded-2xl px-4 py-2.5 w-full min-w-0
            ${isOwn
                            ? 'bg-blue-600 text-white rounded-br-md text-end w-auto'
                            : 'bg-slate-700 text-slate-100 border border-slate-600 rounded-bl-md'
                        }
            ${message.type === 'text' ? '' : 'p-1'}
          `}
                >
                    {/* Message content */}
                    {message.type === 'text' && (
                        <div className="message-text text-sm leading-relaxed w-full min-w-0">
                            {message.content || 'Mesaj bulunamadı'}
                        </div>
                    )}

                    {message.type === 'image' && message.content && (
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={message.content}
                                alt="Shared image"
                                className="max-w-full h-auto"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    )}
                </div>

                {/* Time and status */}
                <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs text-slate-500">
                        {timeLabel}
                    </span>

                    {isOwn && (
                        <StatusIcon />
                    )}
                </div>
            </div>
        </div>
    )
}