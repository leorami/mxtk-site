import { PRESETS_V2, type PresetItem } from '@/lib/home/seedPresetsV2'
import type { HomeDoc, SectionState, WidgetState } from '@/lib/home/types'

export type Mode = 'learn' | 'build' | 'operate'

export const DEFAULT_SECTIONS: SectionState[] = [
  { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
  { id: 'learn',    key: 'learn',    title: 'Learn',    order: 1 },
  { id: 'build',    key: 'build',    title: 'Build',    order: 2 },
  { id: 'operate',  key: 'operate',  title: 'Operate',  order: 3 },
  { id: 'library',  key: 'library',  title: 'Library',  order: 4 },
]

function uniqueIdFactory() {
  const used = new Set<string>()
  return (base: string) => { let n = 1; let out = base; while (used.has(out)) { n++; out = `${base}-${n}` } used.add(out); return out }
}

export function buildSeedDocFromPresets(id: string, mode: Mode): HomeDoc {
  const presets: PresetItem[] = PRESETS_V2[mode] || []
  const mkId = uniqueIdFactory()
  const widgets: WidgetState[] = presets.map(p => ({
    id: mkId(`w-${p.type}-${p.section}`),
    type: p.type as any,
    title: p.title,
    sectionId: p.section,
    pos: { ...p.pos },
    size: { ...p.size },
    data: p.data ? { ...p.data } : undefined,
  })) as any
  const doc: HomeDoc = { id, layoutVersion: 2, sections: DEFAULT_SECTIONS, widgets }
  return doc
}

export function adaptDocWithPresets(doc: HomeDoc, mode: Mode): HomeDoc {
  const presets: PresetItem[] = PRESETS_V2[mode] || []
  const existingPairs = new Set((doc.widgets || []).map(w => `${w.sectionId}::${w.type}`))
  const used = new Set((doc.widgets || []).map(w => w.id))
  const mkId = (base: string) => { let n = 1; let out = base; while (used.has(out)) { n++; out = `${base}-${n}` } used.add(out); return out }
  const adds: WidgetState[] = []
  for (const p of presets) {
    const key = `${p.section}::${p.type}`
    if (existingPairs.has(key)) continue
    const wid = mkId(`w-${p.type}-${p.section}`)
    adds.push({ id: wid, type: p.type as any, title: p.title, sectionId: p.section, pos: { ...p.pos }, size: { ...p.size }, data: p.data ? { ...p.data } : undefined } as any)
    existingPairs.add(key)
  }
  const out: HomeDoc = { ...doc, widgets: [...(doc.widgets || []), ...adds] }
  ;(out as any).meta = { ...(doc as any).meta, lastAdaptMode: mode }
  return out
}


