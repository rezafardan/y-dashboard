// INSTANCE
import axiosInstance from "@/lib/axiosInstance";

// MODELS
import {
  CategoriesDataResponse,
  CreateCategoryData,
} from "@/models/dataSchema";

// DONE
export const getAllCategoriesService = async (): Promise<
  CategoriesDataResponse[]
> => {
  const result = await axiosInstance.get("category", {
    withCredentials: true,
  });
  return result.data.data;
};

export const getCategoryById = async (id: any) => {
  const result = await axiosInstance.get(`category/${id}`, {
    withCredentials: true,
  });
  return result.data.data;
};

// DONE
export const createCategoryService = async (
  data: Omit<CreateCategoryData, "message" | "id">
): Promise<CreateCategoryData> => {
  const result = await axiosInstance.post("category", data, {
    withCredentials: true,
  });
  return result.data;
};

// NOT YET
export const editCategoryService = async (id: any, formEditCategory: any) => {
  const result = await axiosInstance.patch(`category/${id}`, formEditCategory, {
    withCredentials: true,
  });
  return result.data;
};

// DONE
export const deleteCategoryService = async (id: string) => {
  const result = await axiosInstance.delete(`category/${id}`, {
    withCredentials: true,
  });
  return result.data;
};

export const getCategoriesWithBlogCount = async () => {
  const result = await axiosInstance.get(
    "category/categories-with-blog-count",
    {
      withCredentials: true,
    }
  );
  return result.data;
};
