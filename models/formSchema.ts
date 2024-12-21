import { z } from "zod";

// ENUM FOR STATUS BLOG
export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
  SCHEDULE = "SCHEDULE",
}
// ENUM FOR USER ROLE
export enum UserRole {
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  SUBSCRIBER = "SUBSCRIBER",
}

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Tag name must be at least 3 characters" })
    .max(50, { message: "Tag name cannot exceed 50 characters" }),
});

export const editTagSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Tag name must be at least 3 characters" })
    .max(50, { message: "Tag name cannot exceed 50 characters" }),
});

export const editCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(12, { message: "Name must not exceed 12 characters." })
    .regex(/^[A-Za-z ]+$/, {
      message: "Name should only contain letters and must not contain numbers.",
    })
    .transform((name) => name.toUpperCase()),

  // SCHEMA FOR DESCRIPTION VALIDATION
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(100, { message: "Description must not exceed 100 characters." }),
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

export const editUserSchema = z.object({
  username: z.string().optional(),
  fullname: z
    .string()
    .min(4, { message: "Fullname minimum 4 character" })
    .max(30, { message: "Fullname maximum 30 characters" })
    .refine((val) => /^[a-z ]+$/.test(val), {
      message: "Fullname can only contain lowercase letters and spaces",
    })
    .optional(),

  // SCHEMA FOR EMAIL VALIDATION
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email is too long" })
    .refine((email) => !email.endsWith("@tempmail.com"), {
      message: "Temporary emails are not allowed",
    })
    .refine((email) => !email.endsWith("@yopmail.com"), {
      message: "This email domain is not allowed",
    })
    .optional(),

  // SCHEMA FOR PASSWORD VALIDATION
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain an uppercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain a number",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Password must contain a special character (!@#$%^&*)",
    })
    .optional(),

  // SCHEMA FOR PASSWORD CONFIRM VALIDATION
  confirmPassword: z.string().optional(),

  // SCHEMA FOR ROLE VALIDATION
  role: z
    .nativeEnum(UserRole)
    .optional()
    .refine((role) => role !== undefined, {
      message: "Role selection is required",
    }),

  // SCHEMA FOR PROFILE IMAGE VALIDATION
  profileImage: z.instanceof(File).optional(),
});
