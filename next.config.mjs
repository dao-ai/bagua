/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // 如果部署到 GitHub Pages 的子路径，改成 '/bagua'
  basePath: '/bagua',
}

export default nextConfig
