/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/mxtk';
const distDir = process.env.NEXT_DIST_DIR || undefined;

module.exports = {
  basePath,
  assetPrefix: basePath,
  distDir,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Allow dev access via ngrok host (set NGROK_HOST to your domain)
  experimental: {
    optimizePackageImports: [],
    allowedDevOrigins: process.env.NGROK_HOST ? [
      `https://${process.env.NGROK_HOST}`,
      `https://${process.env.NGROK_HOST.replace(/^https?:\/\//,'')}`
    ] : [],
  },
  async rewrites() {
    return [
      // Serve trailing-slash base path without redirect to avoid edge loops
      { source: '/mxtk/', destination: '/mxtk' },
    ];
  },
};
