'use client'

import { Send, Paperclip, Smile } from 'lucide-react'
import { useState, useRef, KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface MessageInputProps {
  conversationId: string
  onMessageSent?: () => void
  currentUserId?: string
}

export default function MessageInput({ 
  conversationId, 
  onMessageSent,
  currentUserId
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending) return

    try {
      setIsSending(true)
      
      // Add optimistic message immediately
      let tempId: string | null = null
      if (currentUserId && (window as any).addOptimisticMessage) {
        tempId = (window as any).addOptimisticMessage(trimmedMessage, currentUserId)
      }
      
      setMessage('') // Clear input immediately for better UX

      const response = await fetch(`/api/messages/conversations/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: trimmedMessage,
          type: 'text'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('MessageInput: Server error:', errorData)
        throw new Error(`Server error: ${errorData.error || 'Failed to send message'}`)
      }
      
      const result = await response.json()
      
      // Replace optimistic message with real one
      if (tempId && result.message && (window as any).replaceOptimisticMessage) {
        (window as any).replaceOptimisticMessage(tempId, result.message)
      }
      
      console.log('MessageInput: Message sent successfully')
      // Don't call onMessageSent to avoid full reload
      
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
      // Restore message text on error
      setMessage(trimmedMessage)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter = new line
        return
      } else {
        // Enter = send message
        e.preventDefault()
        handleSend()
      }
    }
  }

  return (
    <div className="border-t bg-background p-4 flex-shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            className="min-h-[40px] max-h-[120px] resize-none"
            disabled={isSending}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            size="sm"
            className="h-10"
          >
            {isSending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground hidden md:block">
        <span>Enter ile gönder, Shift+Enter ile yeni satır</span>
      </div>
    </div>
  )
}