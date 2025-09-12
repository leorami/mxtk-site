import { describe, expect, it } from 'vitest'
import { getOrSet } from '@/lib/server/cache'

describe('getOrSet cache TTL', () => {
  it('returns same value within TTL and reloads after TTL', async () => {
    let calls = 0
    const loader = async () => { calls += 1; return { v: Math.random() } }

    const a = await getOrSet('x', 50, loader)
    const b = await getOrSet('x', 50, loader)
    expect(b).toEqual(a)
    expect(calls).toBe(1)

    // Wait beyond TTL
    await new Promise(r => setTimeout(r, 60))
    const c = await getOrSet('x', 50, loader)
    // After TTL, we should reload (calls increments)
    expect(calls).toBe(2)
    // Values likely differ but we only assert calls
    expect(c).toBeTruthy()
  })
})


