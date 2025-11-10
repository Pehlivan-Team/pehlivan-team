import { z } from 'zod'

// Post type enum validation aligned with PostType union
export const postTypeEnum = z.enum([
  'social',
  'project_update',
  'sponsored',
  'linked',
  'looking_for_group',
  'study_share',
  'team_update',
])

export const createPostSchema = z
  .object({
    content: z.string().trim().max(5000).optional().or(z.literal('')),
    imageUrl: z.string().url().optional(),
    type: postTypeEnum.optional().default('social'),
    linkUrl: z.string().url().optional(),
  })
  .refine(
    (v) => (v.content && v.content.length > 0) || v.imageUrl || (v.type === 'linked' && v.linkUrl),
    {
      message: 'Content, image, or link is required',
    }
  )
  .refine((v) => (v.type === 'linked' ? !!v.linkUrl : true), {
    message: 'Linked posts require a valid linkUrl',
  })

export const listPostsSchema = z.object({
  username: z.string().trim().min(1),
  limit: z.coerce.number().min(1).max(50).optional(),
  cursor: z.string().optional(),
})

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
})
