import axiosInstance from "@/lib/axiosInstance";
import {
  createUserData,
  deleteUserData,
  editUserData,
  getUsersData,
  checkUsernameData,
} from "@/schema/dataSchema";

export const getAllUserService = async (): Promise<getUsersData[]> => {
  const result = await axiosInstance.get("user", {
    withCredentials: true,
  });
  return result.data.data;
};

export const createUserService = async (data: any): Promise<createUserData> => {
  const result = await axiosInstance.post("user", data, {
    withCredentials: true,
  });
  return result.data;
};

export const editUserService = async (
  id: string,
  formEditCategory: any
): Promise<editUserData[]> => {
  const result = await axiosInstance.patch(`user/${id}`, formEditCategory, {
    withCredentials: true,
  });
  return result.data.data;
};

export const deleteUserService = async (
  id: string
): Promise<deleteUserData> => {
  const result = await axiosInstance.delete(`user/${id}`, {
    withCredentials: true,
  });
  return result.data.data;
};

export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    const result = await axiosInstance.post(
      "user/check-username",
      { username },
      { withCredentials: true }
    );

    console.log(result.data);

    if (result.status === 200) {
      return result.data.isAvailable;
    }

    throw new Error("Unexpected response status");
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
};
