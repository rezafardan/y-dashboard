// INSTANCE
import axiosInstance from "@/lib/axiosInstance";

// MODELS
import { BlogDataResponse, CreateBlogData } from "@/models/dataSchema";

// DONE
export const getAllBlogsService = async (): Promise<BlogDataResponse[]> => {
  const result = await axiosInstance.get("blog", {
    withCredentials: true,
  });
  return result.data.data;
};

export const getBlogByIdService = async (id: any) => {
  const result = await axiosInstance.get(`blog/${id}`, {
    withCredentials: true,
  });
  return result.data.data;
};

export const createImageContent = async (data: FormData) => {
  const result = await axiosInstance.post("blog/content", data, {
    withCredentials: true,
  });
  return result.data;
};

export const createCoverImage = async (data: FormData) => {
  const result = await axiosInstance.post("blog/coverimage", data, {
    withCredentials: true,
  });
  return result.data;
};

// NOT YET
export const createBlogService = async (data: any): Promise<CreateBlogData> => {
  const result = await axiosInstance.post("blog", data, {
    withCredentials: true,
  });
  return result.data;
};

// NOT YET
export const reviewBlogService = async (id: any, formEditBlog: any) => {
  const result = await axiosInstance.patch(`blog/review/${id}`, formEditBlog, {
    withCredentials: true,
  });
  return result.data;
};

// DONE
export const deleteBlogService = async (id: string) => {
  const result = await axiosInstance.delete(`blog/${id}`, {
    withCredentials: true,
  });
  return result.data;
};

export const editBlogService = async (id: any, data: any) => {
  const result = await axiosInstance.patch(`blog/${id}`, data, {
    withCredentials: true,
  });
  return result.data;
};
