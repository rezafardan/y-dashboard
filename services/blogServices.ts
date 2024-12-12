import axiosInstance from "@/lib/axiosInstance";
import {
  BlogDataResponse,
  editBlogData,
  CreateBlogData,
} from "@/schema/dataSchema";

// DONE
export const getAllBlogsService = async (): Promise<BlogDataResponse[]> => {
  const result = await axiosInstance.get("blog");
  return result.data.data;
};

export const getBlogByIdService = async (id: any) => {
  const result = await axiosInstance.get(`blog/${id}`);
  return result.data.data;
};

export const createImageContent = async (data: FormData) => {
  const result = await axiosInstance.post("blog/content", data);
  return result.data;
};

export const createCoverImage = async (data: FormData) => {
  const result = await axiosInstance.post("blog/coverimage", data);
  return result.data;
};

// NOT YET
export const createBlogService = async (data: any): Promise<CreateBlogData> => {
  const result = await axiosInstance.post("blog", data);
  return result.data;
};

// NOT YET
export const reviewBlogService = async (id: any, formEditBlog: any) => {
  const result = await axiosInstance.patch(`blog/review/${id}`, formEditBlog);
  return result.data;
};

// DONE
export const deleteBlogService = async (id: string) => {
  const result = await axiosInstance.delete(`blog/${id}`);
  return result.data;
};
