import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  basePath: "/android",
  assetPrefix: "/android/",

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;