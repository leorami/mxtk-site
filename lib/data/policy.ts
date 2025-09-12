export const FRESHNESS = {
  pools: { ttlMs: 5 * 60_000, warnMs: 10 * 60_000 },
  prices: { ttlMs: 10 * 60_000, warnMs: 30 * 60_000 },
}

export type FreshState = 'fresh' | 'stale' | 'degraded'

export function freshness(updatedAt: number, warnMs: number): FreshState {
  const age = Date.now() - updatedAt
  return age < warnMs ? 'fresh' : age < warnMs * 3 ? 'stale' : 'degraded'
}

export function minutesAgo(ts: number) {
  return Math.max(0, Math.round((Date.now() - ts) / 60_000))
}


