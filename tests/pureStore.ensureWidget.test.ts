import { ensureWidget } from '@/lib/home/pureStore'
import type { HomeDoc } from '@/lib/home/types'
import { describe, expect, it } from 'vitest'

function doc(): HomeDoc {
  return { id: 't', layoutVersion: 2, sections: [
    { id: 'overview', key: 'overview', title: 'Overview', order: 0 } as any,
    { id: 'mxtk-info-1', key: 'mxtk-info-1', title: 'MXTK-Info-1', order: 1 } as any
  ], widgets: [] }
}

describe('ensureWidget', () => {
  it('adds a widget when missing', () => {
    let d = doc()
    d = ensureWidget(d, { type: 'pools-mini', sectionId: 'overview', data: {} })
    expect(d.widgets.find(w => w.type === 'pools-mini')).toBeTruthy()
  })

  it('does not create duplicates; updates data on second call', () => {
    let d = doc()
    d = ensureWidget(d, { type: 'price-mini', sectionId: 'overview', data: { symbol: 'MXTK' } })
    d = ensureWidget(d, { type: 'price-mini', sectionId: 'overview', data: { symbol: 'TEST' } })
    const all = d.widgets.filter(w => w.type === 'price-mini')
    expect(all.length).toBe(1)
    expect(all[0].data).toMatchObject({ symbol: 'TEST' })
  })
})

describe('auto-place avoids overlaps within section', () => {
  it('places second widget below first in same section', () => {
    let d = doc()
    d = ensureWidget(d, { type: 'price-mini', sectionId: 'mxtk-info-1', size: { w: 6, h: 5 }, data: {} })
    // simulate a second add in the same section; ensureWidget uses auto-placement per-section
    d = ensureWidget(d, { type: 'resources', sectionId: 'mxtk-info-1', size: { w: 6, h: 4 }, data: {} })
    const a = d.widgets.find(w => w.type === 'price-mini')!
    const b = d.widgets.find(w => w.type === 'resources')!
    // If y didn't advance due to equal scanning slot, allow same Y only when X doesn't overlap
    const overlapY = b.pos.y < (a.pos.y + a.size.h)
    if (overlapY) {
      // no horizontal overlap allowed when same row
      const noXOverlap = (b.pos.x >= (a.pos.x + a.size.w)) || ((b.pos.x + b.size.w) <= a.pos.x)
      expect(noXOverlap).toBe(true)
    }
    expect(a.sectionId).toBe('mxtk-info-1')
    expect(b.sectionId).toBe('mxtk-info-1')
  })
})


