export default function robots() {
  const isProd = process.env.VERCEL_ENV === 'production'
  return {
    rules: [{ userAgent: '*', disallow: isProd ? [] : ['/'] }],
    sitemap: isProd ? 'https://mineral-token.com/sitemap.xml' : undefined,
  }
}
