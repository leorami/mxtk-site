import { getHome } from '@/lib/home/store/fileStore';
import { describe, expect, it } from 'vitest';

async function pin(widget: { type: string; sectionId?: string; data?: Record<string, unknown> }, id = 'pin_test') {
  const { POST } = await import('@/app/api/ai/home/pin/route')
  const req = new Request('http://localhost/api/ai/home/pin', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, widget }) })
  const res = await POST(req as any)
  const json = await (res as any).json()
  return json
}

describe('Pin to Home API', () => {
  it('creates or updates a widget by type without duplicates', async () => {
    const id = 'pin_test'
    // pin pools-mini
    await pin({ type: 'pools-mini', sectionId: 'overview', data: { token: '0xabc' } }, id)
    const after1 = await getHome(id)
    expect(after1?.widgets.some(w => w.type === 'pools-mini')).toBe(true)

    // pin again with new token -> should update, not duplicate
    await pin({ type: 'pools-mini', sectionId: 'overview', data: { token: '0xdef' } }, id)
    const after2 = await getHome(id)
    const pools = after2!.widgets.filter(w => w.type === 'pools-mini')
    expect(pools.length).toBe(1)
    const token = (pools[0].data as any)?.token
    expect(token === '0xdef' || token === '0xabc').toBe(true)
  })
})
