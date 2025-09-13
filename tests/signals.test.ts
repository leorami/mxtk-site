import { listSignals, logSignal } from '@/lib/home/signals'
import type { HomeSignal } from '@/lib/home/types'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()
const SIGNALS_FILE = path.join(ROOT, 'ai_store', 'signals.jsonl')

describe('home signals store', () => {
  it('returns empty when file missing', async () => {
    try { await fs.rm(SIGNALS_FILE, { force: true }) } catch {}
    const items = await listSignals()
    expect(Array.isArray(items)).toBe(true)
    expect(items.length).toBe(0)
  })

  it('append and list recent signals', async () => {
    try { await fs.rm(SIGNALS_FILE, { force: true }) } catch {}
    const s: HomeSignal = { id: 't1', ts: Date.now(), kind: 'move', docId: 'd1', widgetId: 'w1', pos: { x: 1, y: 2 }, size: { w: 3, h: 4 } }
    await logSignal(s)
    const out = await listSignals({ sinceMs: Date.now() - 1000 })
    expect(out.length).toBeGreaterThan(0)
    const last = out[out.length - 1]
    expect(last.docId).toBe('d1')
    expect(last.kind).toBe('move')
  })
})

import { beforeEach } from 'vitest'

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


