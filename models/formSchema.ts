import { z } from "zod";

// ENUM FOR STATUS BLOG
export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISH = "PUBLISH",
  SCHEDULE = "SCHEDULE",
}

// === ROUTE => USER
// ENUM FOR USER ROLE
export enum UserRole {
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  SUBSCRIBER = "SUBSCRIBER",
  ADMINISTRATOR = "ADMINISTRATOR",
}

// SCHEMA FOR CREATE NEW USER DATA
// ROUTE => /user/create
export const newUserSchema = z
  .object({
    // SCHEMA FOR USERNAME VALIDATION
    username: z
      .string()
      .min(4, { message: "Username minimum 4 characters" })
      .max(14, { message: "Username maximum 14 characters" })
      .refine((val) => !val.includes(" "), {
        message: "Username cannot contain spaces",
      })
      .refine((val) => val === val.toLowerCase(), {
        message: "Username must be lowercase",
      })
      .refine((val) => /^[a-z0-9_]+$/.test(val), {
        message:
          "Username can only contain lowercase letters, numbers and underscore",
      }),

    fullname: z
      .string()
      .min(4, { message: "Fullname minimum 4 character" })
      .max(30, { message: "Fullname maximum 30 characters" })
      .refine((val) => /^[a-z ]+$/.test(val), {
        message: "Fullname can only contain lowercase letters and spaces",
      }),

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
      }),

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
      }),

    // SCHEMA FOR PASSWORD CONFIRM VALIDATION
    confirmPassword: z.string(),

    // SCHEMA FOR ROLE VALIDATION
    role: z
      .nativeEnum(UserRole)
      .optional()
      .refine((role) => role !== undefined, {
        message: "Role selection is required",
      }),

    // SCHEMA FOR PROFILE IMAGE VALIDATION
    profileImage: z.instanceof(File).optional(),
  })

  // SCHEMA FOR BANNED USER VALIDATION
  .refine(
    (data) => {
      const bannedUsernames = ["administrator", "author", "editor"];
      return !bannedUsernames.includes(data.username.toLowerCase());
    },
    {
      message: "Username is not available",
      path: ["username"],
    }
  )
  // SCHEMA FOR PASSWORD CONFIRM VALIDATION
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// SCHEMA FOR EDIT USER DATA
// ROUTE => /user/edit/:id
export const editUserSchema = z.object({
  // SCHEMA FOR USERNAME VALIDATION
  username: z
    .string()
    .min(4, { message: "Username minimum 4 characters" })
    .max(14, { message: "Username maximum 14 characters" })
    .refine((val) => !val.includes(" "), {
      message: "Username cannot contain spaces",
    })
    .refine((val) => val === val.toLowerCase(), {
      message: "Username must be lowercase",
    })
    .refine((val) => /^[a-z0-9_]+$/.test(val), {
      message:
        "Username can only contain lowercase letters, numbers and underscore",
    })
    .optional(),

  // SCHEMA FOR FULLNAME VALIDATION
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
    .optional()
    .refine(
      (password) => {
        if (password && password.length < 6) {
          return false;
        }
        return true;
      },
      {
        message: "Password must be at least 6 characters",
      }
    )
    .refine(
      (password) => {
        if (password) {
          return (
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*]/.test(password)
          );
        }
        return true;
      },
      {
        message:
          "Password must contain an uppercase letter, a number, and a special character (!@#$%^&*)",
      }
    ),

  // SCHEMA FOR PASSWORD CONFIRM VALIDATION
  confirmPassword: z.string(),

  // SCHEMA FOR ROLE VALIDATION
  role: z
    .nativeEnum(UserRole)
    .optional()
    .refine((role) => role !== undefined, {
      message: "Role selection is required",
    })
    .optional(),

  // SCHEMA FOR PROFILE IMAGE VALIDATION
  profileImage: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

// SCHEMA FOR EDIT PROFILE DATA
// ROUTE => /profile

// USER SCHEMA
export const editProfileSchema = z.object({
  // SCHEMA FOR USERNAME VALIDATION
  username: z
    .string()
    .min(4, { message: "Username minimum 4 characters" })
    .max(14, { message: "Username maximum 14 characters" })
    .refine((val) => !val.includes(" "), {
      message: "Username cannot contain spaces",
    })
    .refine((val) => val === val.toLowerCase(), {
      message: "Username must be lowercase",
    })
    .refine((val) => /^[a-z0-9_]+$/.test(val), {
      message:
        "Username can only contain lowercase letters, numbers and underscore",
    })
    .optional(),

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

  password: z
    .string()
    .optional()
    .refine(
      (password) => {
        // Jika password ada, pastikan panjangnya minimal 6 karakter
        if (password && password.length < 6) {
          return false;
        }
        return true; // Validasi sukses jika password tidak ada atau panjangnya cukup
      },
      {
        message: "Password must be at least 6 characters",
      }
    )
    .refine(
      (password) => {
        if (password) {
          // Hanya terapkan regex validation jika password ada
          return (
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*]/.test(password)
          );
        }
        return true; // Jika password tidak ada, abaikan regex validation
      },
      {
        message:
          "Password must contain an uppercase letter, a number, and a special character (!@#$%^&*)",
      }
    ),

  // SCHEMA FOR PASSWORD CONFIRM VALIDATION
  confirmPassword: z.string(),

  // SCHEMA FOR ROLE VALIDATION
  role: z
    .nativeEnum(UserRole)
    .optional()
    .refine((role) => role !== undefined, {
      message: "Role selection is required",
    })
    .optional(),

  // SCHEMA FOR PROFILE IMAGE VALIDATION
  profileImage: z
    .union([
      z.string(), // Untuk URL gambar
      z.instanceof(File), // Untuk file unggahan
      z.null(), // Untuk nilai kosong
    ])
    .optional(), // Nilai tidak wajib
});

// === ROUTE => PROFILE

// SCHEMA FOR EDIT USER DATA
// ROUTE => /user/profile/
export const edistProfileSchema = z.object({
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
