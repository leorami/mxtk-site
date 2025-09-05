/** @type {import('next').NextConfig} */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const DIST_DIR = process.env.NEXT_DIST_DIR || undefined;

const nextConfig = {
  // Use basePath only when running under /mxtk (set via env in the mxtk dev container)
  basePath: BASE_PATH || undefined,
  // CRITICAL: assetPrefix ensures static assets are served from the correct path
  // When basePath is set, assetPrefix must also be set to the same value
  assetPrefix: BASE_PATH || undefined,
  distDir: DIST_DIR,
  images: { 
    unoptimized: true,
    // Ensure images are served from the correct base path
    path: BASE_PATH ? `${BASE_PATH}/_next/image` : '/_next/image',
  },
  experimental: { optimizePackageImports: [] },

  async headers() {
    const prefix = BASE_PATH || '';
    return [
      {
        source: `${prefix}/_next/static/:path*`,
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Timing-Allow-Origin', value: '*' },
        ],
      },
      {
        source: `${prefix}/:file(favicon.ico|favicon.svg|favicon.png|robots.txt|sitemap.xml|manifest.json|site.webmanifest|apple-touch-icon.png)`,
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },

  async rewrites() {
    // Forward external /mxtk/api/* to internal /api/* when basePath is enabled
    return BASE_PATH ? [{ source: `${BASE_PATH}/api/:path*`, destination: `/api/:path*` }] : [];
  },
};

module.exports = nextConfig;
