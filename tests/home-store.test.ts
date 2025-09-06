import { loadHome } from '@/lib/home/store'
import { describe, expect, it } from 'vitest'

describe('home store', () => {
  it('creates empty home', async () => {
    const id = 'test_home'
    const d = await loadHome(id)
    expect(d.id).toBe(id)
  })
})


