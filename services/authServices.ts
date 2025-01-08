// INSTANCE
import axiosInstance from "@/lib/axiosInstance";

// MODELS
import { LoginResponse } from "@/models/dataSchema";

export const loginService = async (credential: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const result = await axiosInstance.post("login", credential, {
    withCredentials: true,
  });
  return result.data;
};

export const logoutService = async () => {
  const result = await axiosInstance.post("logout", {
    withCredentials: true,
  });
  return result.data;
};
