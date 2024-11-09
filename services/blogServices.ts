import axiosInstance from "@/lib/axiosInstance";
import {
  getBlogData,
  editBlogData,
  createBlogData,
  deleteBlogData,
} from "@/schema/dataSchema";

export const getAllBlogsService = async (): Promise<getBlogData[]> => {
  const result = await axiosInstance.get("blog", { withCredentials: true });
  return result.data.data;
};

export const createBlogService = async (data: any): Promise<createBlogData> => {
  const result = await axiosInstance.post("blog", data, {
    withCredentials: true,
  });
  return result.data;
};

export const editBlogService = async (
  id: string,
  formEditBlog: any
): Promise<editBlogData[]> => {
  const result = await axiosInstance.patch(`blog/${id}`, formEditBlog, {
    withCredentials: true,
  });
  return result.data.data;
};

export const deleteBlogService = async (
  id: string
): Promise<deleteBlogData> => {
  const result = await axiosInstance.delete(`blog/${id}`, {
    withCredentials: true,
  });
  return result.data.data;
};
