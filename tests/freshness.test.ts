// vitest
import { freshness, minutesAgo } from '@/lib/data/policy'
import { describe, expect, it } from 'vitest'

describe('freshness', () => {
  it('fresh<warn', () => {
    const now = Date.now()
    expect(freshness(now - 1_000, 600_000)).toBe('fresh')
  })
  it('stale>=warn', () => {
    const now = Date.now()
    expect(freshness(now - 700_000, 600_000)).toBe('stale')
  })
  it('degraded>>warn', () => {
    const now = Date.now()
    expect(freshness(now - 2_000_000, 600_000)).toBe('degraded')
  })
})

describe('minutesAgo', () => {
  it('rounds up', () => {
    const now = Date.now()
    expect(minutesAgo(now - 119_000)).toBe(2)
  })
})


