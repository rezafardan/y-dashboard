// Interface untuk Kategori
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

export interface GetBlogsResponse {
  data: getBlogData[];
  message: string;
}

export interface editBlogData {
  title: string;
  content: string;
  mainImageId?: string;
}

export interface getCategoriesData {
  id: string;
  name: string;
  description: string;
  user: User;
}
