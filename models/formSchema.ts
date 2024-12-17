import { z } from "zod";

// ENUM FOR STATUS BLOG
export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
  SCHEDULE = "SCHEDULE",
}

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Tag name must be at least 3 characters" })
    .max(50, { message: "Tag name cannot exceed 50 characters" }),
});
// BLOG SCHEMA
export const newBlogSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Input with minimum 3 characters" })
    .max(100, { message: "Title can be up to 100 characters" }),
  coverImageId: z.string(),
  content: z
    .string()
    .min(1, { message: "Content must be at least 1 character" }),
  status: z.nativeEnum(BlogStatus).optional(),
  tags: z
    .array(tagSchema)
    .min(1, { message: "Input tag with minimun 1 tag" })
    .max(5, { message: "Input tag with maximum 5 tag" }),
  categoryId: z.string().min(1, { message: "Select minimum 1 option" }),
  allowComment: z.boolean(),
  publishedAt: z.date().optional(),
});
