export type PostStatus = 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED'

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  imageUrl?: string
  // legacy compatibility: many places still check `isPublished`
  isPublished: boolean
  // link author by unique username (preferred) and keep author display name for convenience
  authorUsername?: string
  author?: string
  authorImage?: string
  // canonical stable author id (Firestore user doc id)
  authorId?: string | null
  // audit fields for publish events
  publishedAt?: string | null
  publishedBy?: string | null
  status?: PostStatus
  createdAt: string // ISO string formatında
  updatedAt: string // ISO string formatında
}
