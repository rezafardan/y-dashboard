// INSTANCE
import axiosInstance from "@/lib/axiosInstance";

// MODELS
import { LoginResponse } from "@/models/dataSchema";

export const loginService = async (credential: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const result = await axiosInstance.post("login", credential);
  return result.data;
};

export const logoutService = async () => {
  const result = await axiosInstance.post("logout", null);
  return result.data;
};
