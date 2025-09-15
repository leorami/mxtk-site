import type { WidgetState } from './types';

export type Recommendation = { title: string; href: string; reason: string; score: number }

const WEIGHTS: Record<string, number> = {
  move: 5,
  resize: 5,
  open: 2,
  refresh: 1,
  settings: 1,
  pin: 3,
  unpin: -2,
}

function decayWeight(ts: number, now: number): number {
  const halfLifeMs = 24 * 60 * 60 * 1000 // 24h, faster decay
  const age = Math.max(0, now - ts)
  const factor = Math.pow(0.5, age / halfLifeMs)
  return factor
}

const CANDIDATES: { title: string; href: string; key: string; reason: (counts: Record<string, number>) => string }[] = [
  { title: 'Resources', href: '/resources', key: 'resources', reason: () => 'Helpful documentation and links based on your recent activity' },
  { title: 'FAQ', href: '/faq', key: 'faq', reason: () => 'Answers to common questions you might be exploring' },
  { title: 'Transparency', href: '/transparency', key: 'transparency', reason: () => 'Operational transparency and proofs' },
]

export async function getRecommendations(docId: string, limit = 5): Promise<Recommendation[]> {
  const now = Date.now()
  const { listSignals } = await import('./signals')
  const sigs = await listSignals({ sinceMs: now - 7 * 24 * 60 * 60 * 1000 })
  const relevant = sigs.filter(s => s.docId === docId)

  if (!relevant.length) {
    return CANDIDATES.slice(0, 3).map(c => ({ title: c.title, href: c.href, reason: 'Authoritative internal link', score: 0.1 }))
  }

  // Score by weights and decay
  let score = 0
  const typeCounts: Record<string, number> = Object.create(null)
  for (const s of relevant) {
    const base = WEIGHTS[s.kind] || 0
    const factor = decayWeight(Number(s.ts) || now, now)
    score += base * factor
    typeCounts[s.kind] = (typeCounts[s.kind] || 0) + 1
  }

  // For V0, map a single aggregate score to a small curated list
  const items = CANDIDATES.map(c => ({ title: c.title, href: c.href, reason: c.reason(typeCounts), score }))
  items.sort((a, b) => b.score - a.score)
  return items.slice(0, Math.max(1, Math.min(limit, items.length)))
}

// Basic widget scoring helper for Overview selection
// moved to overviewScore to avoid importing fs on client bundles


