// Local types for search endpoint results
export interface UserSummary {
  id: string
  username: string
  name: string
  profilePictureUrl: string
  team: string
}

export interface PostSearchSummary {
  id: string
  authorUsername: string
  content: string
  imageUrl: string | null
  likeCount: number
  commentCount: number
}

// Prefix range utility for Firestore text prefix queries
export function buildPrefixRange(value: string) {
  const v = value.trim().toLowerCase()
  return { start: v, end: v + '\uf8ff' }
}
