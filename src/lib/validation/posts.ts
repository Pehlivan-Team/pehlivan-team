import { z } from "zod";

export const createPostSchema = z
  .object({
    content: z.string().trim().max(5000).optional().or(z.literal("")),
    imageUrl: z.string().url().optional(),
  })
  .refine((v) => (v.content && v.content.length > 0) || v.imageUrl, {
    message: "Content or image is required",
  });

export const listPostsSchema = z.object({
  username: z.string().trim().min(1),
  limit: z.coerce.number().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});
