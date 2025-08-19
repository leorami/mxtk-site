/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  output: 'standalone',
  async headers() {
    if (process.env.NODE_ENV !== 'production') return []
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: "camera=(), microphone=(), geolocation=()" },
          // Light CSP tuned for marketing site; adjust when adding 3p scripts:
          { key: 'Content-Security-Policy', value:
            "default-src 'self'; img-src 'self' data: https:; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' plausible.io vercel.live; " +
            "style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'self';"
          }
        ]
      }
    ]
  },
  async redirects() {
    // Optional: redirect www.mineral-token.com -> mineral-token.com when the domain is added.
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mineral-token.com' }],
        destination: 'https://mineral-token.com/:path*',
        permanent: true,
      }
    ]
  }
};
export default nextConfig;
