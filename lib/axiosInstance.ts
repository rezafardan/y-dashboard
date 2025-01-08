import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function createAxiosInstance() {
  const cookiesStore = await cookies(); // Tunggu promise
  const accessToken = cookiesStore.get("accessToken");

  console.log("Axios Cookies", accessToken);

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken?.value}`, // Contoh untuk menyertakan token
    },
  });

  axiosInstance.interceptors.request.use(
    (request) => {
      return request;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("Response headers:", response.headers);
      return response;
    },
    async (error) => {
      console.log("Error response:", error.response);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export default createAxiosInstance;
