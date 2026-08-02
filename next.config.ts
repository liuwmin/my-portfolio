import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 注意：默认不再 static export。admin 后台需要 API 路由写入文件。
  // 部署到 Vercel 用标准 Next.js 模式即可。
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
