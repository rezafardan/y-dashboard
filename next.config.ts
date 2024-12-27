import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Mengizinkan semua hostname HTTP
      },
      {
        protocol: "https",
        hostname: "**", // Mengizinkan semua hostname HTTPS
      },
    ],
  },
};

export default nextConfig;
