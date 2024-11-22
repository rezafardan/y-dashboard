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

export enum blogStatus {
  DRAFT,
  PENDING,
  REJECT,
  PUBLISH,
  SCHEDULE,
}

export interface blogDataResponseApi {
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

// CATEGORY LIST INTEFACE > FOR /BLOGS/CATEGORY
export interface categoriesDataResponseApi {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  user: User;
}

export interface createCategoryData {
  message: any;
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

// LOGIN INTERFACE > FOR /LOGIN
export interface userLoginResponseApi {
  id: string;
  username: string;
  role: string;
  profileImage: string;
  deletedAt: Date | null;
}

export interface loginResponseApi {
  message: any;
  user: userLoginResponseApi;
}

// USER LIST INTERFACE > FOR /USERS
export interface userDataResponseApi {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getUsersDataResponseApi {
  message: any;
  user: userDataResponseApi[];
}

export interface createUserData {
  message: any;
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

export interface checkUsernameData {
  username: string;
}
