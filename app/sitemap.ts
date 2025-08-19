export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const routes = ['', '/owners', '/institutions', '/transparency', '/whitepaper', '/roadmap', '/elite-drop', '/elite-drop/nominate', '/media', '/legal/terms', '/legal/privacy', '/legal/disclosures']
  return routes.map((r) => ({
    url: `${base}${r || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: r === '' ? 1.0 : 0.7,
  }))
}
