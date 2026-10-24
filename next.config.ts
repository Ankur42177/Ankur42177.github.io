import type { NextConfig } from "next";

// Static export so the site can be served by GitHub Pages (or Vercel).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
