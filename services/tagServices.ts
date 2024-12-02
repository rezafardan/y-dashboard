import axiosInstance from "@/lib/axiosInstance";

export const getAllTagsService = async (): Promise<any> => {
  const result = await axiosInstance.get("tag");
  return result.data.data;
};
export const deleteTagService = async (id: string) => {
  const result = await axiosInstance.delete(`tag/${id}`);
  return result.data;
};
