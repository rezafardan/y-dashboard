import axiosInstance from "@/lib/axiosInstance";
import {
  createUserData,
  deleteUserData,
  editUserData,
  userDataResponseApi,
  checkUsernameData,
} from "@/schema/dataSchema";

export const getAllUserService = async (): Promise<userDataResponseApi[]> => {
  const result = await axiosInstance.get("user");
  return result.data.user;
};

export const createUserService = async (data: any): Promise<createUserData> => {
  const result = await axiosInstance.post("user", data);
  return result.data;
};

export const editUserService = async (
  id: string,
  formEditCategory: any
): Promise<editUserData[]> => {
  const result = await axiosInstance.patch(`user/${id}`, formEditCategory);
  return result.data.data;
};

export const deleteUserService = async (id: string): Promise<void> => {
  const result = await axiosInstance.delete(`user/${id}`);
  return result.data.data;
};

export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    const result = await axiosInstance.post("user/check-username", {
      username,
    });

    if (result.status === 200) {
      return result.data.isAvailable;
    }

    throw new Error("Unexpected response status");
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
};
