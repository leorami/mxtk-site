// lib/home/types.ts
export type HomeId = string;
export type Mode = 'learn' | 'build' | 'operate';

export type SectionKey = 'overview' | 'learn' | 'build' | 'operate' | 'library';

export interface SectionState {
  id: string;
  key: SectionKey;
  title: string;
  order: number;
  collapsed?: boolean;
}

export type WidgetType =
  | 'recent-answers'
  | 'resources'
  | 'glossary-spotlight'
  | 'whats-next'
  | 'note';

export interface WidgetState {
  id: string;
  type: WidgetType;
  title?: string;
  sectionId: string;
  size: { w: number; h: number }; // grid spans (cols, rows)
  pos: { x: number; y: number };  // zero-based col/row
  pinned?: boolean;
  data?: Record<string, unknown>;
}

/** Legacy V1 (no sections) */
export interface HomeDocV1 {
  id: HomeId;
  layoutVersion?: 1;
  widgets?: any[];
}

/** V2 (sections) */
export interface HomeDoc {
  id: HomeId;
  layoutVersion: 2;
  sections: SectionState[];
  widgets: WidgetState[];
}