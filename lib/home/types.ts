// lib/home/types.ts
export type Experience = 'learn' | 'build' | 'operate'

export type SectionKey = 'overview' | 'learn' | 'build' | 'operate' | 'library'

export interface SectionState {
    id: string
    key: SectionKey
    title: string
    order: number
    collapsed?: boolean
}

export interface WidgetState {
    id: string
    type: string                // e.g., 'recent-answers' | 'glossary-spotlight' | 'resources' | 'custom-note'
    title?: string
    sectionId: string
    pos: { x: number; y: number }
    size: { w: number; h: number }
    pinned?: boolean
    data?: Record<string, unknown>
}

export interface HomeDocV2 {
    id: string
    layoutVersion: 2
    sections: SectionState[]
    widgets: WidgetState[]
    createdAt?: string
    updatedAt?: string
}

export type HomeDocAny = HomeDocV2 | Record<string, any> // for migration gate