import axios from "axios";

const BASE_URL = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
