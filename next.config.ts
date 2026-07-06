import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained production build for Docker / self-hosting.
  // Produces .next/standalone with a minimal server + only the node_modules
  // actually used at runtime — smaller images, no full install needed.
  output: "standalone",
};

export default nextConfig;
