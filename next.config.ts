// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  // In latest Next.js versions, cacheComponents (formerly PPR) is a top-level config
  cacheComponents: true,
} as any; // Cast to any because types might be lagging behind the canary changes

export default nextConfig;
