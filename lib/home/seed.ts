// lib/home/seed.ts
import crypto from 'node:crypto'
import { Experience, HomeDocV2, SectionKey, SectionState, WidgetState } from './types'

const rid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

const SECTION_ORDER: SectionKey[] = ['overview', 'learn', 'build', 'operate', 'library']
const SECTION_TITLES: Record<SectionKey, string> = {
    overview: 'Overview',
    learn: 'Learn',
    build: 'Build',
    operate: 'Operate',
    library: 'Library',
}

export function ensureSections(doc: HomeDocV2): HomeDocV2 {
    const have = new Map(doc.sections.map((s) => [s.key, s]))
    const out: SectionState[] = []

    SECTION_ORDER.forEach((key, idx) => {
        const existing = have.get(key)
        out.push(
            existing || {
                id: `sec-${rid()}`,
                key,
                title: SECTION_TITLES[key],
                order: idx,
            }
        )
    })

    // If new sections were added, keep widgets as-is and return
    return { ...doc, sections: out }
}

type Seed = { section: SectionKey; type: string; size: { w: number; h: number }; pos: { x: number; y: number }; title?: string }

// Base set for all modes (Overview/Learn/Build/Operate panes will differ slightly)
const BASE: Seed[] = [
    { section: 'overview', type: 'recent-answers', size: { w: 6, h: 4 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'resources', size: { w: 6, h: 4 }, pos: { x: 6, y: 0 } },
    { section: 'overview', type: 'glossary-spotlight', size: { w: 4, h: 3 }, pos: { x: 0, y: 4 } },
]

const PER_MODE: Record<Experience, Seed[]> = {
    learn: [
        { section: 'learn', type: 'resources', size: { w: 6, h: 4 }, pos: { x: 0, y: 0 } },
        { section: 'learn', type: 'what-next', size: { w: 6, h: 2 }, pos: { x: 6, y: 0 } },
    ],
    build: [
        { section: 'build', type: 'resources', size: { w: 6, h: 4 }, pos: { x: 0, y: 0 } },
        { section: 'build', type: 'recent-answers', size: { w: 6, h: 4 }, pos: { x: 6, y: 0 } },
    ],
    operate: [
        { section: 'operate', type: 'recent-answers', size: { w: 6, h: 4 }, pos: { x: 0, y: 0 } },
        { section: 'operate', type: 'what-next', size: { w: 6, h: 2 }, pos: { x: 6, y: 0 } },
    ],
}

export function seedDoc(doc: HomeDocV2, mode: Experience, adapt = false): HomeDocV2 {
    // Ensure section objects exist and look up ids by key
    const withSections = ensureSections(doc)
    const byKey = Object.fromEntries(withSections.sections.map((s) => [s.key, s.id])) as Record<SectionKey, string>

    const planned = [...BASE, ...PER_MODE[mode]]
    const exists = new Set(withSections.widgets.map((w) => `${w.sectionId}:${w.type}`))

    const newWidgets: WidgetState[] = []

    for (const p of planned) {
        const secId = byKey[p.section]
        const key = `${secId}:${p.type}`

        if (!exists.has(key)) {
            newWidgets.push({
                id: `w-${rid()}`,
                type: p.type,
                title: p.title,
                sectionId: secId,
                pos: { ...p.pos },
                size: { ...p.size },
                pinned: false,
                data: {},
            })
            exists.add(key)
        } else if (!adapt) {
            // initial seed is idempotent — if widget exists we skip silently
        }
    }

    // If adapt=false and nothing existed, we still add (first-time seed). If adapt=true, we *only* add missing pieces.
    return newWidgets.length ? { ...withSections, widgets: [...withSections.widgets, ...newWidgets] } : withSections
}
