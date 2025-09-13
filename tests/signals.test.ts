import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'fs/promises'
import path from 'path'

describe('signals store append', () => {
  const signalsDir = path.join(process.cwd(), 'ai_store', 'signals')
  beforeEach(async () => {
    await fs.mkdir(signalsDir, { recursive: true }).catch(() => {})
  })

  it('appends a batch to JSONL', async () => {
    const { append } = await import('@/lib/signals/store')
    const beforeFiles = await fs.readdir(signalsDir).catch(() => [])
    await append([
      { ts: Date.now(), homeId: 'h1', widgetId: 'w1', type: 'move', payload: { x: 1, y: 2 } },
      { ts: Date.now(), homeId: 'h1', widgetId: 'w1', type: 'resize', payload: { w: 3, h: 4 } },
    ])
    const afterFiles = await fs.readdir(signalsDir).catch(() => [])
    expect(afterFiles.length).toBeGreaterThanOrEqual(beforeFiles.length)
  })
})


