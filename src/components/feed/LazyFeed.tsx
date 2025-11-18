'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Users, Clock, TrendingUp, Filter } from 'lucide-react'

import PostCard from '@/components/post/PostCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Post } from '@/types/posts'

interface LazyFeedProps {
    initialPosts: Post[]
}

type FeedType = 'all' | 'following' | 'trending'

interface FeedFilters {
    type: FeedType
    postType?: string
    timeRange?: string
}

export default function LazyFeed({ initialPosts }: LazyFeedProps) {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [filters, setFilters] = useState<FeedFilters>({ type: 'all' })
    const [followingCount, setFollowingCount] = useState(0)
    const observerRef = useRef<HTMLDivElement>(null)

    const loadMorePosts = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            const lastPost = posts[posts.length - 1]

            // Ensure cursor is a string — handle Firestore Timestamp (has toDate()) or plain string
            const cursor = (() => {
                if (!lastPost?.createdAt) return new Date().toISOString()
                const created: any = lastPost.createdAt
                return typeof created?.toDate === 'function'
                    ? created.toDate().toISOString()
                    : String(created)
            })()

            const params = new URLSearchParams({
                limit: '10',
                cursor,
                ...(filters.type === 'following' && { following: 'true' }),
                ...(filters.type === 'trending' && { trending: 'true' }),
                ...(filters.postType && { postType: filters.postType }),
                ...(filters.timeRange && { timeRange: filters.timeRange })
            })

            const response = await fetch(`/api/posts?${params}`)

            if (!response.ok) {
                throw new Error('Failed to load posts')
            }

            const data = await response.json()
            const newPosts = data.posts || []

            if (newPosts.length === 0) {
                setHasMore(false)
            } else {
                setPosts(prev => [...prev, ...newPosts])
            }
        } catch (error) {
            console.error('Error loading posts:', error)
        } finally {
            setLoading(false)
        }
    }, [loading, hasMore, posts, filters])

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !loading) {
                    loadMorePosts()
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => observer.disconnect()
    }, [loadMorePosts, hasMore, loading])

    // Load following count for current user
    useEffect(() => {
        if (session?.user?.username) {
            fetch(`/api/follow/${session.user.username}`)
                .then(res => res.json())
                .then(data => setFollowingCount(data.followingCount || 0))
                .catch(console.error)
        }
    }, [session?.user?.username])

    // Reload posts when filters change
    const handleFilterChange = useCallback(async (newFilters: Partial<FeedFilters>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)
        setLoading(true)
        setPosts([])
        setHasMore(true)

        try {
            const params = new URLSearchParams({
                limit: '20',
                ...(updatedFilters.type === 'following' && { following: 'true' }),
                ...(updatedFilters.type === 'trending' && { trending: 'true' }),
                ...(updatedFilters.postType && { postType: updatedFilters.postType }),
                ...(updatedFilters.timeRange && { timeRange: updatedFilters.timeRange })
            })

            const response = await fetch(`/api/posts?${params}`)
            const data = await response.json()
            const newPosts = data.posts || []

            setPosts(newPosts)
            setHasMore(newPosts.length >= 20)
        } catch (error) {
            console.error('Error filtering posts:', error)
            setPosts(initialPosts) // Fallback to initial posts
        } finally {
            setLoading(false)
        }
    }, [filters, initialPosts])

    const getFeedTypeIcon = (type: FeedType) => {
        switch (type) {
            case 'following': return <Users className="h-4 w-4" />
            case 'trending': return <TrendingUp className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Feed Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    {/* Feed Type Tabs */}
                    <div className="flex gap-2">
                        <Button
                            variant={filters.type === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterChange({ type: 'all' })}
                            className="flex items-center gap-2"
                        >
                            <Clock className="h-4 w-4" />
                            Hepsi
                        </Button>

                        {session?.user && followingCount > 0 && (
                            <Button
                                variant={filters.type === 'following' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange({ type: 'following' })}
                                className="flex items-center gap-2"
                            >
                                <Users className="h-4 w-4" />
                                Takip Ettiklerim
                                <Badge variant="secondary" className="ml-1">
                                    {followingCount}
                                </Badge>
                            </Button>
                        )}

                        <Button
                            variant={filters.type === 'trending' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterChange({ type: 'trending' })}
                            className="flex items-center gap-2"
                        >
                            <TrendingUp className="h-4 w-4" />
                            Trend
                        </Button>
                    </div>

                    {/* Additional Filters */}
                    <div className="flex gap-2 items-center">
                        <Filter className="h-4 w-4 text-slate-400" />

                        <Select
                            value={filters.postType || 'all'}
                            onValueChange={(value) => handleFilterChange({ postType: value === 'all' ? undefined : value })}
                        >
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Tür" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tümü</SelectItem>
                                <SelectItem value="social">Sosyal</SelectItem>
                                <SelectItem value="project_update">Proje</SelectItem>
                                <SelectItem value="team_update">Takım</SelectItem>
                                <SelectItem value="study_share">Çalışma</SelectItem>
                                <SelectItem value="looking_for_group">Grup Arama</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.timeRange || 'all'}
                            onValueChange={(value) => handleFilterChange({ timeRange: value === 'all' ? undefined : value })}
                        >
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Zaman" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tümü</SelectItem>
                                <SelectItem value="today">Bugün</SelectItem>
                                <SelectItem value="week">Bu Hafta</SelectItem>
                                <SelectItem value="month">Bu Ay</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active Filter Indicator */}
                {(filters.type !== 'all' || filters.postType || filters.timeRange) && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            {getFeedTypeIcon(filters.type)}
                            <span>Aktif Filtreler:</span>
                            <Badge variant="outline" className="text-xs">
                                {filters.type === 'all' ? 'Tümü' :
                                    filters.type === 'following' ? 'Takip Ettiklerim' : 'Trend'}
                            </Badge>
                            {filters.postType && (
                                <Badge variant="outline" className="text-xs">
                                    {filters.postType}
                                </Badge>
                            )}
                            {filters.timeRange && (
                                <Badge variant="outline" className="text-xs">
                                    {filters.timeRange === 'today' ? 'Bugün' :
                                        filters.timeRange === 'week' ? 'Bu Hafta' :
                                            filters.timeRange === 'month' ? 'Bu Ay' : filters.timeRange}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Posts List */}
            <div className="space-y-6">
                {posts.length === 0 && loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                        <span className="ml-2 text-slate-400">Paylaşımlar yükleniyor...</span>
                    </div>
                )}

                {posts.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-slate-400 mb-4">
                            {filters.type === 'following'
                                ? 'Takip ettiğin kişilerden henüz paylaşım yok. Daha fazla kişi takip etmeyi dene!'
                                : 'Henüz paylaşım bulunamadı.'}
                        </div>
                        {filters.type === 'following' && (
                            <Button
                                variant="outline"
                                onClick={() => handleFilterChange({ type: 'all' })}
                            >
                               Hepsi
                            </Button>
                        )}
                    </div>
                )}

                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
                <div ref={observerRef} className="py-6 flex justify-center">
                    {loading ? (
                        <div className="flex items-center text-slate-400">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Daha fazla paylaşım yükleniyor...
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={loadMorePosts}
                            className="flex items-center gap-2"
                        >
                            Daha Fazla Yükle
                        </Button>
                    )}
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center py-6 text-slate-500">
                    Tüm paylaşımlar yüklendi 🎉
                </div>
            )}
        </div>
    )
} 