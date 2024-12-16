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
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 || !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh token");
        const response = await axios.post(
          `${BASE_URL}/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
        console.log("Refresh Token Response:", response);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
