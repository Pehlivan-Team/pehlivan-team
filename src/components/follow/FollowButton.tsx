'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FollowButtonProps {
    targetUsername: string
    initialFollowState?: boolean
    showFollowersCount?: boolean
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg'
    className?: string
}

interface FollowStats {
    followersCount: number
    followingCount: number
    isFollowing: boolean
}

export default function FollowButton({
    targetUsername,
    initialFollowState = false,
    showFollowersCount = false,
    variant = 'default',
    size = 'default',
    className = ''
}: FollowButtonProps) {
    const { data: session } = useSession()
    const [isFollowing, setIsFollowing] = useState(initialFollowState)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<FollowStats | null>(null)
    const [mounted, setMounted] = useState(false)

    const currentUsername = session?.user?.username
    const canFollow = currentUsername && currentUsername !== targetUsername

    // Load follow stats
    useEffect(() => {
        if (!targetUsername) return

        const loadStats = async () => {
            try {
                const response = await fetch(`/api/follow/${targetUsername}`)
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                    setIsFollowing(data.isFollowing)
                }
            } catch (error) {
                console.error('Failed to load follow stats:', error)
            }
        }

        loadStats()
        setMounted(true)
    }, [targetUsername])

    const handleFollowToggle = async () => {
        if (!canFollow || loading) return

        setLoading(true)
        try {
            const method = isFollowing ? 'DELETE' : 'POST'
            const response = await fetch(`/api/follow/${targetUsername}`, {
                method,
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update follow status')
            }

            const newIsFollowing = !isFollowing
            setIsFollowing(newIsFollowing)

            // Update local stats
            if (stats) {
                setStats(prev => prev ? {
                    ...prev,
                    followersCount: newIsFollowing ? prev.followersCount + 1 : prev.followersCount - 1,
                    isFollowing: newIsFollowing
                } : null)
            }

            // Show success message
            toast.success(
                newIsFollowing
                    ? `${targetUsername} takip ediliyor!`
                    : `${targetUsername} takipten çıkarıldı`
            )
        } catch (error) {
            console.error('Follow toggle error:', error)
            toast.error('Takip işlemi başarısız oldu. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    // Don't render anything until mounted (prevents hydration issues)
    if (!mounted || !canFollow) {
        return showFollowersCount && stats ? (
            <Badge variant="outline" className={className}>
                {stats.followersCount} takipçi
            </Badge>
        ) : null
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Button
                variant={isFollowing ? 'outline' : variant}
                size={size}
                onClick={handleFollowToggle}
                disabled={loading}
                className={`
          flex items-center gap-2 transition-all duration-200
          ${isFollowing
                        ? 'hover:bg-red-500/10 hover:border-red-500 hover:text-red-500'
                        : 'hover:scale-105'
                    }
        `}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isFollowing ? (
                    <UserMinus className="h-4 w-4" />
                ) : (
                    <UserPlus className="h-4 w-4" />
                )}

                <span className="hidden sm:inline">
                    {loading
                        ? 'İşleniyor...'
                        : isFollowing
                            ? 'Takipten Çık'
                            : 'Takip Et'
                    }
                </span>
            </Button>

            {showFollowersCount && stats && (
                <Badge variant="outline" className="text-xs">
                    {stats.followersCount} takipçi
                </Badge>
            )}
        </div>
    )
}

// Hook for follow stats
export function useFollowStats(username: string) {
    const [stats, setStats] = useState<FollowStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!username) return

        const loadStats = async () => {
            try {
                const response = await fetch(`/api/follow/${username}`)
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to load follow stats:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [username])

    return { stats, loading, refresh: () => setLoading(true) }
} 