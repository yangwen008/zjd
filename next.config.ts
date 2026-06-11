import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "*.r2.cloudflarestorage.com" }] },
  experimental: { serverActions: { bodySizeLimit: "50mb" } },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ]
      }
    ];
  }
};
export default nextConfig;
