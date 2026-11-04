import type { NextConfig } from "next";
import { redirects } from "./redirects.mjs";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return redirects;
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
