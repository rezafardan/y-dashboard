import axiosInstance from "@/lib/axiosInstance";
import {
  CategoriesDataResponse,
  editCategoryData,
  CreateCategoryData,
} from "@/schema/dataSchema";

// DONE
export const getAllCategoriesService = async (): Promise<
  CategoriesDataResponse[]
> => {
  const result = await axiosInstance.get("category");
  return result.data.data;
};

// DONE
export const createCategoryService = async (
  data: CreateCategoryData
): Promise<CreateCategoryData> => {
  const result = await axiosInstance.post("category", data);
  return result.data;
};

// NOT YET
export const editCategoryService = async (
  id: string,
  formEditCategory: any
): Promise<editCategoryData[]> => {
  const result = await axiosInstance.patch(`category/${id}`, formEditCategory);
  return result.data.data;
};

// DONE
export const deleteCategoryService = async (id: string) => {
  const result = await axiosInstance.delete(`category/${id}`);
  return result.data;
};
