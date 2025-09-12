// vitest integration-lite
import { FRESHNESS, freshness } from '@/lib/data/policy'
import { describe, expect, it } from 'vitest'

describe('alerts and warm helpers (smoke)', () => {
  it('freshness tuple exists', () => {
    expect(FRESHNESS.pools.warnMs).toBeGreaterThan(0)
    expect(['fresh','stale','degraded']).toContain(freshness(Date.now(), 1))
  })
})


