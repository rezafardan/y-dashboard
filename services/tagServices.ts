// INSTANCE
import axiosInstance from "@/lib/axiosInstance";

export const createTagService = async (data: any): Promise<any> => {
  const result = await axiosInstance.post("tag", data, {
    withCredentials: true,
  });
  return result.data;
};

export const getAllTagsService = async (): Promise<any> => {
  const result = await axiosInstance.get("tag", {
    withCredentials: true,
  });
  return result.data.data;
};

export const getTagByIdService = async (id: any): Promise<any> => {
  const result = await axiosInstance.get(`tag/${id}`, {
    withCredentials: true,
  });
  return result.data.data;
};

export const editTagService = async (id: any, formEditUser: any) => {
  const result = await axiosInstance.patch(`tag/${id}`, formEditUser, {
    withCredentials: true,
  });
  return result.data;
};

export const deleteTagService = async (id: string) => {
  const result = await axiosInstance.delete(`tag/${id}`, {
    withCredentials: true,
  });
  return result.data;
};
