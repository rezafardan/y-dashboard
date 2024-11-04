// Interface untuk Kategori
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // ID dari pengguna yang membuat kategori
}

// Interface untuk Pengguna
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // Pastikan untuk tidak menyertakan ini di respons yang dibagikan ke klien
  role: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null; // Jika deletedAt bisa null
}

// Interface untuk Blog
export interface getBlogData {
  id: string;
  title: string;
  content: string;
  category: Category; // Menggunakan interface Kategori
  user: User; // Menggunakan interface Pengguna
  publishedAt: Date;
  createdAt: Date;
  mainImageId: string | null; // Jika mainImageId bisa null
  updatedAt: Date;
  status: string;
}

// Interface untuk respons dari API
export interface GetBlogsResponse {
  data: getBlogData[]; // Array dari getBlogData
  message: string; // Pesan dari respons
}

// Interface untuk Permintaan Edit Blog
export interface editBlogData {
  title: string;
  content: string;
  mainImageId?: string; // Gunakan optional jika tidak selalu ada
}
