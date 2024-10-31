import { z } from "zod";

export const createBlogFormSchema = z.object({
  title: z.string().min(3, {
    message: "Judul harus lebih dari 3 karakter!",
  }),
  content: z.string().min(10, {
    message: "Content harus lebih dari 10 karakter!",
  }),
  userId: z.string(),
  mainImageId: z.string().optional(),
  categoryId: z.string(),
  tags: z.string().optional(),
  createdAt: z.date().optional(),
});

export type CreateBlogFormSchema = z.infer<typeof createBlogFormSchema>;
