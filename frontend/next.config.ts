import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for deployment
  output: "standalone",

  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1",
  },
};

export default nextConfig;
