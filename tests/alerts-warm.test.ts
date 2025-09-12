// vitest integration-lite
import { describe, it, expect } from 'vitest'
import { FRESHNESS, freshness } from '@/lib/data/policy'

describe('alerts and warm helpers (smoke)', () => {
  it('freshness tuple exists', () => {
    expect(FRESHNESS.pools.warnMs).toBeGreaterThan(0)
    expect(['fresh','stale','degraded']).toContain(freshness(Date.now(), 1))
  })
})


