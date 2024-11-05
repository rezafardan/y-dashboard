import axiosInstance from "@/lib/axiosInstance";
import { getCategoriesData } from "@/schema/dataSchema";

export const getAllCategoriesService = async (): Promise<
  getCategoriesData[]
> => {
  const result = await axiosInstance.get("/category");
  return result.data.data;
};

export const createCategoryService = async (data: any) => {
  const result = await axiosInstance.post("/category", data);
  return result.data.data;
};
