import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // In Next.js 16, turbopack config moved from experimental.turbo to top-level turbopack
  turbopack: {},
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

