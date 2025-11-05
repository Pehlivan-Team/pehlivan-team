export interface Post {
  id: string;
  authorUsername: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface PostComment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: any; // Firestore Timestamp
}

// Requests / Responses
export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

export interface CreatePostResponse {
  id: string;
}

export interface ListPostsQuery {
  username: string;
  limit?: number;
  cursor?: string; // ISO date string of createdAt
}

export interface ListPostsResponse {
  posts: Post[];
  nextCursor?: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface ListCommentsResponse {
  comments: PostComment[];
  nextCursor?: string;
}

export interface CreateCommentRequest {
  content: string;
}



