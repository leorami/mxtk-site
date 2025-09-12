import { describe, expect, it, vi } from 'vitest'
import { getPoolsByToken } from '@/lib/data/adapters/dexscreener'
import * as dex from '@/lib/data/adapters/dexscreener'

describe('adapters backoff/timeout', () => {
  it('dexscreener returns [] on 429 after retries', async () => {
    const orig = global.fetch
    const mockRes = (status: number) => ({ ok: false, status, json: async () => ({}) }) as any
    // First two calls 429, then 503 to exhaust
    let calls = 0
    // @ts-ignore
    global.fetch = vi.fn(async () => { calls += 1; return mockRes(429) })
    const out = await getPoolsByToken('0xdead')
    expect(Array.isArray(out)).toBe(true)
    expect(out.length).toBe(0)
    // @ts-ignore
    global.fetch = orig
  })
})


