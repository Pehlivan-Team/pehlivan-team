import type { Timestamp } from 'firebase/firestore'

// Allowed post types. Extendable.
export type PostType =
  | 'social'
  | 'project_update'
  | 'sponsored' // admins only
  | 'linked' // external link (github, linkedin etc)
  | 'looking_for_group'
  | 'study_share'
  | 'team_update'

export interface Post {
  id: string
  authorUsername: string
  authorId: string
  content: string
  imageUrl?: string
  imageUrls?: string[]
  mentions?: string[]
  hashtags?: string[]
  likeCount: number
  commentCount: number
  createdAt: Timestamp // Firestore Timestamp
  updatedAt: Timestamp // Firestore Timestamp
  type: PostType // new field
  linkUrl?: string // for 'linked' posts
}

export interface PostComment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: Timestamp // Firestore Timestamp
}

// Requests / Responses
export interface CreatePostRequest {
  content: string
  imageUrl?: string
  imageUrls?: string[]
  mentions?: string[]
  hashtags?: string[]
  type?: PostType // optional on create; defaults to 'social'
  linkUrl?: string // required if type === 'linked'
}

export interface CreatePostResponse {
  id: string
}

export interface ListPostsQuery {
  username: string
  limit?: number
  cursor?: string // ISO date string of createdAt
}

export interface ListPostsResponse {
  posts: Post[]
  nextCursor?: string
}

export interface ToggleLikeResponse {
  liked: boolean
  likeCount: number
}

export interface ListCommentsResponse {
  comments: PostComment[]
  nextCursor?: string
}

export interface CreateCommentRequest {
  content: string
}
