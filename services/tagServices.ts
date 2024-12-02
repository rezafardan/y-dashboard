import axiosInstance from "@/lib/axiosInstance";
import { TagDataResponse } from "@/schema/dataSchema";

// DONE
export const getAllTagsService = async () => {
  const result = await axiosInstance.get("tag");
  return result.data.data;
};
