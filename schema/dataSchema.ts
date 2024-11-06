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

export interface createBlogData {
  id: string;
  title: string;
  content: string;
  category: Category;
  user: User;
  publishedAt: Date;
  mainImageId: string;
  status: string;
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
