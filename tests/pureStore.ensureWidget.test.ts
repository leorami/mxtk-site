import { ensureWidget } from '@/lib/home/pureStore'
import type { HomeDoc } from '@/lib/home/types'
import { describe, expect, it } from 'vitest'

function doc(): HomeDoc {
  return { id: 't', layoutVersion: 2, sections: [{ id: 'overview', key: 'overview', title: 'Overview', order: 0 } as any], widgets: [] }
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


