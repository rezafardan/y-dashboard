// INSTANCE
import axiosInstance from "@/lib/axiosInstance";

// MODELS
import {
  CreateUserData,
  editUserData,
  UserDataResponse,
} from "@/models/dataSchema";

// DONE
export const getAllUserService = async (): Promise<UserDataResponse[]> => {
  const result = await axiosInstance.get("user");
  return result.data.data;
};

// NOT YET
export const getUserByIdService = async (id: any) => {
  const result = await axiosInstance.get(`user/${id}`);
  return result.data.data;
};

// DONE
export const createUserService = async (
  data: FormData
): Promise<CreateUserData> => {
  const result = await axiosInstance.post("user", data);
  return result.data;
};

// NOT YET
export const editUserService = async (
  id: any,
  data: FormData
): Promise<editUserData> => {
  const result = await axiosInstance.patch(`user/${id}`, data);
  return result.data;
};

// DONE
export const softDeleteUserService = async (id: string) => {
  const result = await axiosInstance.patch(`user/softdelete/${id}`);
  return result.data;
};

// DONE
export const restoreSoftDeleteUserService = async (id: string) => {
  const result = await axiosInstance.patch(`user/restore/${id}`);
  return result.data;
};

// DONE
export const permanentDeleteUserService = async (id: string) => {
  const result = await axiosInstance.delete(`user/${id}`);
  return result.data;
};

// DONE
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
    return false;
  }
};

// NOT YET
export const viewUserProfileService = async () => {
  const result = await axiosInstance.get("user/me");
  return result.data.data;
};

// NOT YET
export const editUserProfileService = async (data: any) => {
  const result = await axiosInstance.patch("user/me", data);
  return result.data;
};
