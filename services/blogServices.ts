import axiosInstance from "@/lib/axiosInstance";
import { getBlogData, editBlogData } from "@/schema/dataSchema";

export const getAllBlogsService = async (): Promise<getBlogData[]> => {
  const result = await axiosInstance.get("blog");
  return result.data.data;
};

export const createBlogService = async (data: any) => {
  const result = await axiosInstance.post("blog", data);
  return result.data.data;
};

export const editBlogService = async (
  id: number,
  formEditBlog: any
): Promise<editBlogData[]> => {
  const result = await axiosInstance.patch(`blog/${id}`, formEditBlog);
  return result.data.data;
};

export const deleteBlogService = async (id: string) => {
  const result = await axiosInstance.delete(`blog/${id}`);
  return result.data.data;
};
