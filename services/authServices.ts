import axiosInstance from "@/lib/axiosInstance";
import { getUsersData } from "@/schema/dataSchema";

export const loginService = async (data: any): Promise<getUsersData> => {
  const result = await axiosInstance.post("login", data, {
    withCredentials: true,
  });
  return result.data;
};
