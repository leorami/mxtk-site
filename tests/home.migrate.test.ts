import { adaptDocWithPresets, buildSeedDocFromPresets } from '@/lib/home/seedUtil'
import { getHome as readHome, putHome as writeHome } from '@/lib/home/store/fileStore'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Home auto-provision + seed (store-level)', () => {
  const id = `test_auto_${Math.random().toString(36).slice(2)}`
  beforeEach(async () => {
    // ensure missing at start
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const ROOT = process.cwd()
    const HOMES = path.join(ROOT, 'ai_store', 'homes')
    await fs.mkdir(HOMES, { recursive: true })
    try { await fs.unlink(path.join(HOMES, `${id}.json`)) } catch {}
  })

  it('creates and seeds when doc missing', async () => {
    const base = { id, layoutVersion: 2, sections: [
      { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
      { id: 'learn', key: 'learn', title: 'Learn', order: 1 },
      { id: 'build', key: 'build', title: 'Build', order: 2 },
      { id: 'operate', key: 'operate', title: 'Operate', order: 3 },
      { id: 'library', key: 'library', title: 'Library', order: 4 },
    ], widgets: [] } as any
    await writeHome(base)
    const seeded = buildSeedDocFromPresets(id, 'build')
    await writeHome(seeded)
    const saved = await readHome(id)
    expect(saved).toBeTruthy()
    expect(Array.isArray(saved!.widgets)).toBe(true)
    expect(saved!.widgets.length).toBeGreaterThan(0)
  })

  it('idempotent seed when widgets === 0', async () => {
    const empty = { id, layoutVersion: 2, sections: [
      { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
      { id: 'learn', key: 'learn', title: 'Learn', order: 1 },
      { id: 'build', key: 'build', title: 'Build', order: 2 },
      { id: 'operate', key: 'operate', title: 'Operate', order: 3 },
      { id: 'library', key: 'library', title: 'Library', order: 4 },
    ], widgets: [] } as any
    await writeHome(empty)
    const out = adaptDocWithPresets(empty as any, 'build')
    await writeHome(out)
    const saved = await readHome(id)
    expect(saved!.widgets.length).toBeGreaterThan(0)
  })
})


