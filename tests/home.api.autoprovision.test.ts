import { describe, expect, it } from 'vitest'

// Lightweight integration using Next route handler directly is complex in Vitest.
// Here we validate handler shape assumptions indirectly by ensuring store seed doc shape is valid.

describe('Home API autoprovision (contract expectations)', () => {
  it('seed presets include price-large and pools-table in overview', async () => {
    const { buildSeedDocFromPresets } = await import('@/lib/home/seedUtil')
    const doc = buildSeedDocFromPresets('api_test', 'build')
    const overview = doc.widgets.filter(w => w.sectionId === 'overview')
    const types = new Set(overview.map(w => w.type))
    expect(types.has('price-large')).toBe(true)
    expect(types.has('pools-table')).toBe(true)
    expect(types.has('content-widget')).toBe(true)
  })
})


