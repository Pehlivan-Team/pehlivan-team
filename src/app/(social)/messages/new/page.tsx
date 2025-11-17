'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: string
  name: string
  username: string
  profilePictureUrl?: string
}

export default function NewConversationPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchUsers()
    } else {
      setUsers([])
    }
  }, [searchQuery])

  const searchUsers = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/search/users?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error('Failed to search users')
      }

      const data = await response.json()
      // Filter out current user
      const filteredUsers = data.users?.filter((user: User) => user.id !== session?.user?.id) || []
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Error searching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const startConversation = async (userId: string) => {
    try {
      setCreating(true)
      setError(null)

      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'direct',
          participantIds: [userId]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create conversation')
      }

      const data = await response.json()
      
      // Navigate to the new conversation (API returns conversation object with id field)
      const conversationId = data.conversation?.id
      if (conversationId) {
        router.push(`/messages/${conversationId}`)
      } else {
        throw new Error('No conversation ID returned')
      }
    } catch (error: any) {
      console.error('Error creating conversation:', error)
      setError(error.message || 'Konuşma başlatılamadı')
    } finally {
      setCreating(false)
    }
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
    <div className="h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <Link href="/messages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">Yeni Sohbet</h1>
            <p className="text-sm text-slate-400">Mesajlaşmak istediğiniz kişiyi seçin</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kullanıcı ara..."
            className="
              pl-10 bg-slate-800/60 border-slate-700 text-slate-100 
              placeholder:text-slate-500 focus:border-emerald-600
            "
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 mx-4 mt-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2 text-red-400 hover:text-red-300"
            >
              Kapat
            </Button>
          </div>
        )}

        {!searchQuery.trim() && (
          <div className="p-6 text-center text-slate-500">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Mesajlaşmak istediğiniz kişinin ismini veya kullanıcı adını arayın</p>
          </div>
        )}

        {loading && (
          <div className="p-2 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searchQuery.trim().length >= 2 && users.length === 0 && (
          <div className="p-6 text-center text-slate-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Kullanıcı bulunamadı</p>
            <p className="text-xs mt-1">Farklı bir arama terimi deneyin</p>
          </div>
        )}

        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => startConversation(user.id)}
            disabled={creating}
            className="
              w-full p-3 flex items-center gap-3 hover:bg-slate-800/50 
              transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <Avatar className="h-12 w-12 border border-slate-700">
              <AvatarImage src={user.profilePictureUrl} />
              <AvatarFallback className="bg-slate-800 text-slate-300">
                {user.name[0]?.toUpperCase() || user.username[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-200 truncate">
                {user.name}
              </h3>
              <p className="text-sm text-slate-400 truncate">
                @{user.username}
              </p>
            </div>

            {creating && (
              <div className="text-sm text-emerald-400">Başlatılıyor...</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}