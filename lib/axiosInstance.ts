import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Mengaktifkan pengiriman cookies pada setiap permintaan
});

let isRefreshing = false; // Menandakan apakah sedang melakukan refresh token
let failedQueue: Array<{
  resolve: (value?: AxiosResponse<any, any>) => void;
  reject: (reason?: any) => void;
}> = []; // Antrian untuk permintaan yang tertunda

// Fungsi untuk memproses antrian setelah refresh token selesai
const processQueue = (error: any, response: AxiosResponse<any, any> | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(response as AxiosResponse<any, any>);
    }
  });
  failedQueue = [];
};

// Interceptor untuk response
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Jika tidak ada error, kembalikan respons
  },
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
      error.config;

    // Tangani error 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai bahwa request ini sudah dicoba ulang

      // Jika sedang refresh token, masukkan permintaan ke dalam antrian
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Setelah refresh selesai, ulangi permintaan
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Jika belum, mulai proses refresh token
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          console.log("Attempting to refresh token...");
          // Refresh token request
          const response = await axios.post(
            `${BASE_URL}/refresh-token`,
            {},
            { withCredentials: true }
          );

          console.log("Refresh Token Successful:", response);

          // Proses semua request dalam antrian
          processQueue(null, response);

          // Ulangi permintaan asli
          resolve(axiosInstance(originalRequest));
        } catch (refreshError) {
          console.error("Refresh Token Failed:", refreshError);

          // Gagal refresh token, arahkan ke halaman login
          processQueue(refreshError, null);
          window.location.href = "/login";
          reject(refreshError);
        } finally {
          isRefreshing = false; // Reset flag setelah selesai
        }
      });
    }

    return Promise.reject(error); // Untuk error selain 401, teruskan error
  }
);

export default axiosInstance;
