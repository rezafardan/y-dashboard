import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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

export default axiosInstance;
