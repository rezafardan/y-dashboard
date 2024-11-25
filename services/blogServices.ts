import axiosInstance from "@/lib/axiosInstance";
import {
  BlogDataResponse,
  editBlogData,
  createBlogData,
  deleteBlogData,
} from "@/schema/dataSchema";

export const getAllBlogsService = async (): Promise<BlogDataResponse[]> => {
  const result = await axiosInstance.get("blog");
  return result.data.data;
};

export const createBlogService = async (data: any): Promise<createBlogData> => {
  const result = await axiosInstance.post("blog", data);
  return result.data;
};

export const editBlogService = async (
  id: string,
  formEditBlog: any
): Promise<editBlogData[]> => {
  const result = await axiosInstance.patch(`blog/${id}`, formEditBlog);
  return result.data.data;
};

export const deleteBlogService = async (id: string) => {
  const result = await axiosInstance.delete(`blog/${id}`);
  return result.data;
};
