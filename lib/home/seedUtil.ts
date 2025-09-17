import { PRESETS_V2, type PresetItem } from '@/lib/home/seedPresetsV2'
import type { HomeDoc, SectionState, WidgetState } from '@/lib/home/types'

export type Mode = 'learn' | 'build' | 'operate'

export const DEFAULT_SECTIONS: SectionState[] = [
  { id: 'overview',      key: 'overview',      title: 'Overview',    order: 0 },
  { id: 'mxtk-info-1',   key: 'mxtk-info-1',   title: 'MXTK-Info-1', order: 1 },
  { id: 'learn',         key: 'learn',         title: 'Training',    order: 2 },
  { id: 'mxtk-info-2',   key: 'mxtk-info-2',   title: 'MXTK-Info-2', order: 3 },
  { id: 'build',         key: 'build',         title: 'Preparing',   order: 4 },
  { id: 'mxtk-info-3',   key: 'mxtk-info-3',   title: 'MXTK-Info-3', order: 5 },
  { id: 'operate',       key: 'operate',       title: 'Conquering',  order: 6 },
  { id: 'library',       key: 'library',       title: 'Library',     order: 7 },
  { id: 'mxtk-footer',   key: 'mxtk-footer',   title: 'MXTK-Footer', order: 8 },
]

function uniqueIdFactory() {
  const used = new Set<string>()
  return (base: string) => { let n = 1; let out = base; while (used.has(out)) { n++; out = `${base}-${n}` } used.add(out); return out }
}

export function buildSeedDocFromPresets(id: string, mode: Mode): HomeDoc {
  const presets: PresetItem[] = PRESETS_V2[mode] || []
  const mkId = uniqueIdFactory()
  const META: Record<string, Partial<WidgetState>> = {
    'whats-next': { stages: ['training','preparing','conquer'], priority: 5, mobileFriendly: true } as any,
    'recent-answers': { stages: ['training'], priority: 3, mobileFriendly: true } as any,
    'resources': { stages: ['training','preparing','conquer'], priority: 4, mobileFriendly: true } as any,
    'price-large': { stages: ['preparing','conquer'], priority: 3, mobileFriendly: true } as any,
    'pools-table': { stages: ['preparing','conquer'], priority: 4, mobileFriendly: true } as any,
    'pools-mini': { stages: ['preparing','conquer'], priority: 3, mobileFriendly: true } as any,
    'price-mini': { stages: ['preparing','conquer'], priority: 2, mobileFriendly: true } as any,
    'glossary-spotlight': { stages: ['training'], priority: 3, mobileFriendly: true } as any,
    'note': { stages: ['training'], priority: 1, mobileFriendly: true } as any,
    'content-widget': { stages: ['training','preparing','conquer'], priority: 3, mobileFriendly: true } as any,
  }
  const widgets: WidgetState[] = presets.map(p => ({
    id: mkId(`w-${p.type}-${p.section}`),
    type: p.type as any,
    title: p.title,
    sectionId: p.section,
    pos: { ...p.pos },
    size: { ...p.size },
    data: p.data ? { ...p.data } : undefined,
    ...(META[p.type] || {})
  })) as any
  const doc: HomeDoc = { id, layoutVersion: 2, sections: DEFAULT_SECTIONS, widgets }
  return doc
}

export function adaptDocWithPresets(doc: HomeDoc, mode: Mode): HomeDoc {
  const presets: PresetItem[] = PRESETS_V2[mode] || []
  // Ensure sections exist to render in Dashboard
  const sections = Array.isArray((doc as any).sections) && (doc as any).sections.length
    ? (doc as any).sections
    : DEFAULT_SECTIONS
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
  const out: HomeDoc = { ...doc, sections: sections as any, widgets: [...(doc.widgets || []), ...adds] }
  ;(out as any).meta = { ...(doc as any).meta, lastAdaptMode: mode }
  return out
}


