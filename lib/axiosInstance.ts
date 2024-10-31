import axios from "axios";

const BASE_URL = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    console.log("Kesalahan API : ", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Response Error : ", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
