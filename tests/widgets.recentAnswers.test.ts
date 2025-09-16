import { stripMarkdown } from '@/lib/utils/text'
import { describe, expect, it } from 'vitest'

describe('RecentAnswers markdown stripping', () => {
  it('removes code ticks and md glyphs', () => {
    const input = "**Hello** `code` _world_ ~strike~ # heading - list"
    const out = stripMarkdown(input)
    expect(out).toContain('Hello')
    expect(out).toContain('world')
    expect(out.includes('`')).toBe(false)
    expect(/[*_~#-]/.test(out)).toBe(false)
  })

  it('keeps link text only', () => {
    const input = "See [docs](https://example.com) for more"
    const out = stripMarkdown(input)
    expect(out).toBe('See docs for more')
  })
})


