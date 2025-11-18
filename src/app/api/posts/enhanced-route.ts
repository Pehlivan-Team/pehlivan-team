import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import admin from 'firebase-admin'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { firestoreAdmin } from '@/lib/firebase-admin'

// Validation schemas
const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  type: z.enum(['social', 'project_update', 'sponsored', 'linked', 'looking_for_group', 'study_share', 'team_update']).optional(),
  imageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  linkUrl: z.string().url().optional(),
  mentions: z.array(z.string()).optional(),
  hashtags: z.array(z.string()).optional(),
})

const listPostsSchema = z.object({
  username: z.string().optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional(),
  cursor: z.string().optional(),
  following: z.string().optional(),
  trending: z.string().optional(),
  postType: z.string().optional(),
  timeRange: z.string().optional(),
})

export interface CreatePostResponse {
  id: string
}

export interface ListPostsResponse {
  posts: any[]
  nextCursor?: string
}

// CREATE POST
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const parsed = createPostSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { content, type, imageUrl, imageUrls, linkUrl, mentions, hashtags } = parsed.data

    const session: any = await getServerSession(authOptions as any)
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can create sponsored posts
    if (type === 'sponsored' && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can create sponsored content.' },
        { status: 403 }
      )
    }

    // Resolve a stable authorId
    let authorId: string | null = session?.user?.id ?? null
    if (!authorId) {
      try {
        const username = session.user.username
        let q = await firestoreAdmin.collection('users').where('username', '==', username).limit(1).get()
        if (!q.empty) {
          authorId = q.docs[0].id
        } else if (session.user.email) {
          q = await firestoreAdmin.collection('users').where('email', '==', session.user.email).limit(1).get()
          if (!q.empty) authorId = q.docs[0].id
        }
      } catch (e) {
        console.warn('Could not resolve authorId for session user:', e)
      }
    }

    const now = admin.firestore.FieldValue.serverTimestamp()

    const docData: any = {
      authorUsername: session.user.username,
      authorId: authorId || null,
      content,
      imageUrl: imageUrl || (Array.isArray(imageUrls) && imageUrls.length ? imageUrls[0] : null),
      imageUrls: Array.isArray(imageUrls) && imageUrls.length ? imageUrls : (imageUrl ? [imageUrl] : null),
      type: type || 'social',
      linkUrl: linkUrl || null,
      likeCount: 0,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    if (mentions && mentions.length) docData.mentions = mentions
    if (hashtags && hashtags.length) docData.hashtags = hashtags

    const docRef = await firestoreAdmin.collection('posts').add(docData)

    const res: CreatePostResponse = { id: docRef.id }
    return NextResponse.json(res, { status: 201 })
  } catch (error) {
    console.error('Create post error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// GET POSTS (Enhanced with lazy loading and following)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const session: any = await getServerSession(authOptions as any)
    
    // Extract and validate query parameters
    const username = searchParams.get('username')
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const cursor = searchParams.get('cursor')
    const following = searchParams.get('following') === 'true'
    const trending = searchParams.get('trending') === 'true'
    const postType = searchParams.get('postType')
    const timeRange = searchParams.get('timeRange')

    // Validate limits
    if (limit > 50) {
      return NextResponse.json({ error: 'Limit cannot exceed 50' }, { status: 400 })
    }

    // If username is provided, get posts for specific user
    if (username) {
      let query = firestoreAdmin
        .collection('posts')
        .where('authorUsername', '==', username)
        .orderBy('createdAt', 'desc')
        .limit(limit + 1)

      if (cursor && cursor !== 'null' && cursor !== 'undefined') {
        try {
          const cursorTs = admin.firestore.Timestamp.fromDate(new Date(cursor))
          query = query.startAfter(cursorTs)
        } catch (e) {
          console.warn('Invalid cursor format:', cursor, e)
          // Skip cursor if invalid
        }
      }

      const snapshot = await query.get()
      const docs = snapshot.docs
      const hasNext = docs.length > limit
      const pageDocs = hasNext ? docs.slice(0, limit) : docs

      const posts = pageDocs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        }
      })
      
      const nextCursor = hasNext
        ? posts[posts.length - 1].createdAt
        : undefined

      return NextResponse.json({ posts, nextCursor }, { status: 200 })
    }

    // General feed logic
    let query: admin.firestore.Query = firestoreAdmin.collection('posts')

    // Filter by post type
    if (postType && postType !== 'all') {
      query = query.where('type', '==', postType)
    }

    // Filter by time range
    if (timeRange && timeRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }
      
      if (startDate.getTime() > 0) {
        query = query.where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
      }
    }

    // Handle following-based feed
    if (following && session?.user?.username) {
      const followsRef = firestoreAdmin.collection('follows')
      const followingSnapshot = await followsRef
        .where('follower', '==', session.user.username)
        .get()
      
      const followingUsernames = followingSnapshot.docs.map(doc => doc.data().target)
      
      if (followingUsernames.length === 0) {
        return NextResponse.json({ posts: [], nextCursor: undefined }, { status: 200 })
      }
      
      // Handle Firestore 'in' query limitation (max 10 values)
      const chunks = []
      for (let i = 0; i < followingUsernames.length; i += 10) {
        chunks.push(followingUsernames.slice(i, i + 10))
      }
      
      let allPosts: any[] = []
      for (const chunk of chunks) {
        let chunkQuery = query.where('authorUsername', 'in', chunk)
        
        if (cursor && cursor !== 'null' && cursor !== 'undefined') {
          try {
            const cursorTs = admin.firestore.Timestamp.fromDate(new Date(cursor))
            chunkQuery = chunkQuery.where('createdAt', '<', cursorTs)
          } catch (e) {
            console.warn('Invalid cursor format for following feed:', cursor, e)
            // Skip cursor if invalid
          }
        }
        
        chunkQuery = chunkQuery.orderBy('createdAt', 'desc').limit(Math.ceil((limit + 1) / chunks.length))
        
        const chunkSnapshot = await chunkQuery.get()
        const chunkPosts = chunkSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
          }
        })
        allPosts.push(...chunkPosts)
      }
      
      // Sort by creation date and limit
      allPosts.sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime()
        const bTime = new Date(b.createdAt || 0).getTime()
        return bTime - aTime
      })
      
      const hasNext = allPosts.length > limit
      const posts = hasNext ? allPosts.slice(0, limit) : allPosts
      
      const nextCursor = hasNext && posts.length > 0
        ? posts[posts.length - 1].createdAt
        : undefined
      
      return NextResponse.json({ posts, nextCursor }, { status: 200 })
    }

    // Trending feed logic
    if (trending) {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      query = query
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(threeDaysAgo))
        .where('likeCount', '>=', 1)
    }

    // Add pagination cursor
    if (cursor && cursor !== 'null' && cursor !== 'undefined') {
      try {
        const cursorTs = admin.firestore.Timestamp.fromDate(new Date(cursor))
        query = query.where('createdAt', '<', cursorTs)
      } catch (e) {
        console.warn('Invalid cursor format for general feed:', cursor, e)
        // Skip cursor if invalid
      }
    }

    // Order and limit
    query = query.orderBy('createdAt', 'desc').limit(limit + 1)

    const snapshot = await query.get()
    let posts: any[] = snapshot.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      }
    })

    // For trending, sort by engagement score
    if (trending) {
      posts.sort((a, b) => {
        const scoreA = (a.likeCount || 0) * 2 + (a.commentCount || 0) * 3
        const scoreB = (b.likeCount || 0) * 2 + (b.commentCount || 0) * 3
        return scoreB - scoreA
      })
    }

    const hasNext = posts.length > limit
    const finalPosts = hasNext ? posts.slice(0, limit) : posts

    // Batch-fetch author profiles
    try {
      const usernames = Array.from(new Set(finalPosts.map((p: any) => p.authorUsername).filter(Boolean)))
      const authorProfiles: Record<string, any> = {}

      const chunk = (arr: string[], size = 10) => {
        const res: string[][] = []
        for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
        return res
      }

      const chunks = chunk(usernames, 10)
      for (const c of chunks) {
        const usersQ = await firestoreAdmin
          .collection('users')
          .where('username', 'in', c)
          .get()
        usersQ.docs.forEach((ud) => {
          const data = ud.data()
          authorProfiles[data.username] = {
            username: data.username,
            name: data.name,
            profilePictureUrl: data.profilePictureUrl || null,
            bio: data.bio,
            socialLinks: data.socialLinks || null,
          }
        })
      }

      finalPosts.forEach((p: any) => {
        p.authorProfile = authorProfiles[p.authorUsername] || null
      })
    } catch (err) {
      console.warn('Could not batch author profiles', err)
    }

    const nextCursor = hasNext && finalPosts.length > 0
      ? (finalPosts[finalPosts.length - 1] as any).createdAt
      : undefined

    return NextResponse.json({ posts: finalPosts, nextCursor }, { status: 200 })
    
  } catch (error) {
    console.error('Get posts error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}