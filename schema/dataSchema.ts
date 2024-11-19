// {
//   "id": "cm3kxdcny0002wa56xxf59rcb",
//   "status": "DRAFT",
//   "title": "Lorem Ipsum ea Tempuribud Sint Quis",
//   "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elitdolor ut aliquip pulvinar sit nulla elit adipiscing.",
//   "mainImageId": null,
//   "allowComment": true,
//   "likeCount": 0,
//   "viewCount": 0,
//   "publishedAt": null,
//   "createdAt": "2024-11-17T01:35:30.911Z",
//   "updatedAt": "2024-11-17T01:35:30.911Z",
//   "deletedAt": null,
//   "isUserActive": true,
//   "tags": [],
//   "category": {
//       "id": "cm3jg9y2z0003o20f0leezvi3",
//       "name": "MUSIC",
//       "description": "DESCRIPTION OF MUSIC CATEGORY",
//       "createdAt": "2024-11-16T00:49:12.393Z",
//       "updatedAt": "2024-11-16T00:49:12.393Z",
//       "deleteAt": null,
//       "userId": "cm3jb3f36000055qq6fckrve1",
//       "isUserActive": true
//   },
//   "user": {
//       "id": "cm3jb3f36000055qq6fckrve1",
//       "username": "administrator",
//       "email": "administrator@email.com",
//       "passwordHash": "$2b$10$23gm2HZrtBOY1Kj8P4vZJOeeX4mMSNhfnKRgCKYk61o1Git1rKjZy",
//       "role": "ADMINISTRATOR",
//       "profileImage": "profileImageAdministrator.jpg",
//       "createdAt": "2024-11-15T22:24:09.762Z",
//       "updatedAt": "2024-11-15T22:24:09.762Z",
//       "deletedAt": null
//   }
// },

// "id": "cm3jg9y2z0003o20f0leezvi3",
// "name": "MUSIC",
// "description": "DESCRIPTION OF MUSIC CATEGORY",
// "user": {
//     "id": "cm3jb3f36000055qq6fckrve1",
//     "username": "administrator",
//     "email": "administrator@email.com",
//     "passwordHash": "$2b$10$23gm2HZrtBOY1Kj8P4vZJOeeX4mMSNhfnKRgCKYk61o1Git1rKjZy",
//     "role": "ADMINISTRATOR",
//     "profileImage": "profileImageAdministrator.jpg",
//     "createdAt": "2024-11-15T22:24:09.762Z",
//     "updatedAt": "2024-11-15T22:24:09.762Z",
//     "deletedAt": null
// },
// "createdAt": "2024-11-16T00:49:12.393Z",
// "updatedAt": "2024-11-16T00:49:12.393Z",
// "isUserActive": true

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
  // updatedAt: string;
  // deletedAt: string | null;
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
