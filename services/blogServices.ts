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

export const getAllTagsService = async () => {
  const result = await axiosInstance.get("tag");
  return result.data.data;
};

// NOT YET
export const createBlogService = async (
  data: FormData
): Promise<CreateBlogData> => {
  const result = await axiosInstance.post("blog", data);
  return result.data;
};

// NOT YET
export const editBlogService = async (
  id: string,
  formEditBlog: any
): Promise<editBlogData[]> => {
  const result = await axiosInstance.patch(`blog/${id}`, formEditBlog);
  return result.data.data;
};

// DONE
export const deleteBlogService = async (id: string) => {
  const result = await axiosInstance.delete(`blog/${id}`);
  return result.data;
};
