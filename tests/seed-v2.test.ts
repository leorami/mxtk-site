import { migrateToV2 } from '@/lib/home/migrate'
import { adaptDocWithPresets, buildSeedDocFromPresets } from '@/lib/home/seedUtil'
import { getHome, putHome } from '@/lib/home/store/fileStore'
import { describe, expect, it } from 'vitest'

async function seed(id: string, mode: 'learn'|'build'|'operate', adapt = false) {
  const existing = await getHome(id)
  if (!existing) {
    const fresh = buildSeedDocFromPresets(id, mode)
    await putHome(fresh)
    return fresh
  }
  const { doc } = migrateToV2(existing)
  const out = adapt ? adaptDocWithPresets(doc, mode) : doc
  await putHome(out)
  return out
}

describe('Seed Presets V2', () => {
  it('creates a V2 doc with widgets across sections (learn)', async () => {
    const id = 'seedv2_learn'
    const out = await seed(id, 'learn')
    expect(out).toBeTruthy()
    const { doc } = migrateToV2(out)
    expect(doc.layoutVersion).toBe(2)
    const sections = new Set(doc.sections.map(s => s.id))
    expect(sections.has('overview')).toBe(true)
    expect(sections.has('learn')).toBe(true)
    expect(sections.has('library')).toBe(true)
    expect(doc.widgets.length).toBeGreaterThanOrEqual(5)
    // Ensure no empty widgets for minis
    for (const w of doc.widgets) {
      if (w.type === 'pools-mini') {
        expect((w.data as any)?.token).toBeTruthy()
      }
      if (w.type === 'price-mini') {
        expect((w.data as any)?.symbol).toBeTruthy()
      }
      if (w.title) {
        expect(typeof w.title).toBe('string')
      }
    }
  })

  it('adapt=true appends missing widgets without deleting', async () => {
    const id = 'seedv2_adapt'
    // Seed learn
    await seed(id, 'learn')
    const before = await getHome(id)
    expect(before).toBeTruthy()
    const countBefore = before!.widgets.length
    // Adapt to build
    const out = await seed(id, 'build', true)
    const after = await getHome(id)
    expect(after!.widgets.length).toBeGreaterThanOrEqual(countBefore)
    // No duplicates by (sectionId,type)
    const pairs = new Set<string>()
    for (const w of after!.widgets) {
      const key = `${w.sectionId}::${w.type}`
      expect(pairs.has(key)).toBe(false)
      pairs.add(key)
    }
  })
})


