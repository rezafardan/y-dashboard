export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface getBlogData {
  id: string;
  title: string;
  content: string;
  category: Category;
  user: User;
  publishedAt: Date;
  createdAt: Date;
  mainImageId: string | null;
  updatedAt: Date;
  status: string;
}

// === BLOG SCHEMA ===
// id                      String             @id @default(cuid())
// title                   String             @db.VarChar(255)
// content                 String             @db.Text
// status                  BlogStatus         @default(DRAFT)
// viewCount               Int                @default(0) @map("view_count")
// likeCount               Int                @default(0) @map("like_count")
// allowComment            Boolean            @map("allow_comment")
// schedulePulblishedAt    DateTime?          @map("schedule_published_at")
// publishedAt             DateTime?          @map("published_at")
// createdAt               DateTime           @default(now()) @map("created_at")
// updatedAt               DateTime           @updatedAt @map("edited_at")
// deletedAt               DateTime?          @map("deleted_at")
// mainImageId             String?            @map("main_image_id")
// userId                  String             @map("user_id")
// categoryId              String             @map("category_id")
// isUserActive            Boolean?           @default(true) @map("is_user_active")

export interface createBlogData {
  id: string;
  title: string;
  content: string;
  status: string;
  allowComment: boolean;
  schedulePulblishedAt: Date;
  publishedAt: Date;
  mainImageId: string;
  category: Category;
  user: User;
  message: any;
}

export interface editBlogData {
  title: string;
  content: string;
  mainImageId?: string;
}

export interface deleteBlogData {
  id: string;
}

export interface getCategoriesData {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  user: User;
}

export interface createCategoryData {
  id: string;
  name: string;
  description: string;
  user: User;
}

export interface editCategoryData {
  name: string;
  description: string;
}

export interface deleteCategoryData {
  id: string;
}

export interface getUsersData {
  message: any;
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  profileImage: string;
  createdAt: Date;
}

export interface createUserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  profileImage: string;
}

export interface editUserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  profileImage: string;
  createdAt: Date;
}

export interface deleteUserData {
  id: string;
}
