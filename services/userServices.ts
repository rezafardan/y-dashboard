import axiosInstance from "@/lib/axiosInstance";
import {
  createUserData,
  deleteUserData,
  editUserData,
  getUsersData,
} from "@/schema/dataSchema";

export const getAllUserService = async (): Promise<getUsersData[]> => {
  const result = await axiosInstance.get("user");
  return result.data.data;
};

export const createUserService = async (data: any): Promise<createUserData> => {
  const result = await axiosInstance.post("user", data);
  return result.data.data;
};

export const editUserService = async (
  id: string,
  formEditCategory: any
): Promise<editUserData[]> => {
  const result = await axiosInstance.patch(`user/${id}`, formEditCategory);
  return result.data.data;
};

export const deleteUserService = async (
  id: string
): Promise<deleteUserData> => {
  const result = await axiosInstance.delete(`user/${id}`);
  return result.data.data;
};
