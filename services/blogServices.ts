// blogServices.ts
import axiosInstance from "@/lib/axiosInstance";
import { Blog } from "@/schema/getBlogsSchema";

export const getBlogs = async (): Promise<Blog[]> => {
  const result = await axiosInstance.get("blog");
  return result.data.data;
};
