import axiosInstance from "@/lib/axiosInstance";
import { loginResponseApi } from "@/schema/dataSchema";

export const loginService = async (credential: {
  username: string;
  password: string;
}): Promise<loginResponseApi> => {
  const result = await axiosInstance.post("login", credential);
  return result.data;
};

export const logoutService = async () => {
  const result = await axiosInstance.post("logout", null);
  return result.data;
};
