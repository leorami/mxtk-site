/** @type {import('next').NextConfig} */
const nextConfig = {
  // App is agnostic; no basePath/assetPrefix.
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ['lucide-react'] },

  // Prevents Next from normalizing `/path/` -> `/path` with a 308.
  trailingSlash: false,
};

module.exports = nextConfig;
