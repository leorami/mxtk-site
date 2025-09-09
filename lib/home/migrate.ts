// lib/home/migrate.ts
import crypto from 'node:crypto'
import { HomeDocAny, HomeDocV2, SectionKey, SectionState, WidgetState } from './types'

const rid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export function toV2(raw: HomeDocAny, opts?: { titleOverrides?: Partial<Record<SectionKey, string>> }): HomeDocV2 {
    // Already v2?
    if (raw && raw.layoutVersion === 2 && Array.isArray(raw.sections) && Array.isArray(raw.widgets)) {
        return raw as HomeDocV2
    }

    // V1 shape (widgets only)
    const v1Widgets: any[] = Array.isArray((raw as any)?.widgets) ? (raw as any).widgets : []
    const id: string = (raw as any)?.id || rid()

    const sectionTitle = (k: SectionKey) =>
        (opts?.titleOverrides?.[k]) ||
        ({
            overview: 'Overview',
            learn: 'Learn',
            build: 'Build',
            operate: 'Operate',
            library: 'Library',
        }[k])

    const sectionOverview: SectionState = {
        id: `sec-${rid()}`,
        key: 'overview',
        title: sectionTitle('overview')!,
        order: 0,
    }

    const widgets: WidgetState[] = v1Widgets.map((w) => ({
        id: w.id || `w-${rid()}`,
        type: w.type || 'custom-note',
        title: w.title,
        sectionId: sectionOverview.id,
        pos: w.pos || { x: 0, y: 0 },
        size: w.size || { w: 4, h: 3 },
        pinned: w.pinned || false,
        data: w.data || {},
    }))

    const v2: HomeDocV2 = {
        id,
        layoutVersion: 2,
        sections: [sectionOverview],
        widgets,
        createdAt: (raw as any)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    return v2
}
