export type Stage = 'training' | 'preparing' | 'conquer'
export type Signals = {
  pins: string[]
  recency: Record<string, number>
  dwell: Record<string, number>
  prompts: Record<string, number>
}
export type WidgetMeta = {
  id: string
  stages: Stage[]
  priority: number
  mobileFriendly: boolean
  categories: string[]
}

function stableHash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return h >>> 0
}

function scoreForSignals(id: string, sig: Signals): number {
  const pin = sig.pins.includes(id) ? 1 : 0
  const r = Math.max(0, Math.min(1, sig.recency[id] ?? 0))
  const d = Math.max(0, Math.min(1, sig.dwell[id] ?? 0))
  const p = Math.max(0, Math.min(1, sig.prompts[id] ?? 0))
  return pin * 1 + r * 0.6 + d * 0.3 + p * 0.4
}

export function selectWidgets({ stage, signals, registry, alpha = 0.6, beta = 0.3, gamma = 0.1, max = 8 }: { stage: Stage; signals: Signals; registry: WidgetMeta[]; alpha?: number; beta?: number; gamma?: number; max?: number }): WidgetMeta[] {
  const scored = registry.map(w => {
    const stageFit = w.stages.includes(stage) ? 1 : 0
    const signalScore = scoreForSignals(w.id, signals)
    const base = Math.max(0, Math.min(1, w.priority))
    const score = stageFit * alpha + signalScore * beta + base * gamma
    const pinned = Array.isArray(signals.pins) ? signals.pins.includes(w.id) : false
    const dwell = Math.max(0, Math.min(1, signals.dwell[w.id] ?? 0))
    return { w, score, pinned, dwell }
  }).sort((a, b) => {
    // Strongly prefer pinned items first; then dwell; then composite score
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    if (b.dwell !== a.dwell) return b.dwell - a.dwell
    return (b.score - a.score) || (stableHash(a.w.id) - stableHash(b.w.id))
  })

  // Pick top N
  let out = scored.slice(0, Math.min(max, scored.length)).map(s => s.w)

  // Ensure category coverage
  const required = ['Owners','Transparency','Resources']
  const present = new Set(out.flatMap(w => w.categories))
  for (const cat of required) {
    if (!present.has(cat)) {
      const next = scored.find(s => s.w.categories.includes(cat) && !out.some(o => o.id === s.w.id))?.w
      if (next) {
        // Replace the lowest-scoring item not in required categories
        let replaceIdx = out.length - 1
        for (let i = out.length - 1; i >= 0; i--) {
          const w = out[i]
          if (!w.categories.some(c => required.includes(c))) { replaceIdx = i; break }
        }
        out[replaceIdx] = next
        present.add(cat)
      }
    }
  }
  // Preserve scored order; comparator above already applies deterministic tie-breaks
  return out
}


