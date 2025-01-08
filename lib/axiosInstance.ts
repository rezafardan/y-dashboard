import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
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
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const redirect = error.response?.data?.redirect;

    // Cek status 401 atau 403 untuk redirect ke login
    if (status === 401 || status === 403) {
      if (redirect) {
        // Redirect ke halaman login
        window.location.href = redirect;
      } else {
        // Default redirect jika `redirect` tidak tersedia
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
