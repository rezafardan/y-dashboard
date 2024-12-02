// LOGIN INTERFACE > FOR /LOGIN
export interface UserDataLoginResponse {
  id: string;
  username: string;
  role: string;
  profileImage: string;
  deletedAt: Date | null;
}
// DONE

export interface LoginResponse {
  message: any;
  user: UserDataLoginResponse;
}
// DONE

// ================================================== //

// USER LIST INTERFACE > FOR /USERS
export interface UserDataResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
// DONE

export interface CreateUserData {
  message: any;
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  profileImage: string;
}
// DONE

export interface editUserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  profileImage: string;
  createdAt: Date;
}
// NOT YET

// ================================================== //

// CATEGORY LIST INTEFACE > FOR /BLOGS/CATEGORY
export interface CategoriesDataResponse {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  user: User;
}
// DONE

export interface CreateCategoryData {
  message: any;
  id: string;
  name: string;
  description: string;
  userId: string;
}
// DONE

export interface editCategoryData {
  name: string;
  description: string;
}
// NOT YET

// ================================================== //

// BLOG LIST INTEFACE > FOR /BLOGS
export interface BlogDataResponse {
  id: string;
  status: blogStatus;
  title: string;
  content: string;
  mainImageId: string;
  allowComment: boolean;
  likeCount: Number;
  viewCount: Number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isUserActive: boolean;
  tags: null;
  category: Category;
  user: User;
}
// DONE

export enum blogStatus {
  DRAFT,
  PENDING,
  REJECT,
  PUBLISH,
  SCHEDULE,
}
// DONE

export interface CreateBlogData {
  id: string;
  title: string;
  content: JSON;
  status: string;
  allowComment: boolean;
  schedulePulblishedAt: Date;
  publishedAt: Date;
  mainImageId: string;
  category: Category;
  user: User;
  message: any;
}
// NOT YET

export interface editBlogData {
  title: string;
  content: string;
  mainImageId?: string;
}
// NOT YET

// ================================================== //

// CATEGORY DATA GLOBAL
export interface Category {
  id: string;
  name: string;
  description: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isUserActive: boolean;
}
// DONE

// USER DATA GLOBAL
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
// DONE

// ================================================== //
