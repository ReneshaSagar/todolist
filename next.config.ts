import type { NextConfig } from "next";
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  // Use Turbopack empty config or specify webpack if needed
  // Note: @ducanh2912/next-pwa uses webpack under the hood
  turbopack: {}
};

export default withPWA(nextConfig);
