import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.10'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withBotId(nextConfig);