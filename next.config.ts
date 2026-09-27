import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config, options) {
    // Set up alias to match the `tsconfig.json` paths
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname), // This allows `@/` to map to the root directory
    };

    return config;
  },
};

export default nextConfig;
