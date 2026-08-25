import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  basePath: "/android",
  assetPrefix: "/android/",

  images: {
    unoptimized: true,
  },

  reactCompiler: true,
};

export default nextConfig;