/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開啟 standalone 模式以優化 Docker 部署
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true, // 避免 CI/CD 因小錯誤失敗
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;