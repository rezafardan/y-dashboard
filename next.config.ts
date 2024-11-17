import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // styledComponents: true,
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
};

export default nextConfig;
