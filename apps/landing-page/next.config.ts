import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@erp/env",
    "@erp/logger",
    "@erp/testing",
    "@erp/ui",
    "@erp/utils",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
