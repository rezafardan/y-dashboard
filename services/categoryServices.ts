import axiosInstance from "@/lib/axiosInstance";
import {
  getCategoriesData,
  editCategoryData,
  createCategoryData,
  deleteCategoryData,
} from "@/schema/dataSchema";

export const getAllCategoriesService = async (): Promise<
  getCategoriesData[]
> => {
  const result = await axiosInstance.get("category");
  return result.data.data;
};

export const createCategoryService = async (
  data: any
): Promise<createCategoryData> => {
  const result = await axiosInstance.post("category", data);
  return result.data.data;
};

export const editCategoryService = async (
  id: string,
  formEditCategory: any
): Promise<editCategoryData[]> => {
  const result = await axiosInstance.patch(`category/${id}`, formEditCategory);
  return result.data.data;
};

export const deleteCategoryService = async (
  id: string
): Promise<deleteCategoryData> => {
  const result = await axiosInstance.delete(`category/${id}`);
  return result.data.data;
};
