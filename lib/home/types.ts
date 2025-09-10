// lib/home/types.ts
export type HomeId = string;
export type SectionKey = 'overview' | 'learn' | 'build' | 'operate' | 'library';
export type Experience = 'learn' | 'build' | 'operate';

export type WidgetType =
  | 'recent-answers'
  | 'resources'
  | 'glossary-spotlight'
  | 'note'
  | 'whats-next';

export interface SectionState {
  id: string;
  key: SectionKey;
  title: string;
  order: number;
  collapsed?: boolean;
}

export interface WidgetState {
  id: string;
  type: string;                // e.g., 'recent-answers' | 'glossary-spotlight' | 'resources' | 'custom-note'
  title?: string;
  sectionId: string;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  pinned?: boolean;
  data?: Record<string, unknown>;
}

export interface HomeDocV1 {
  id: HomeId;
  layoutVersion?: 1;
  widgets: (Omit<WidgetState,'sectionId'> & { sectionId?: string })[];
}

export interface HomeDocV2 {
  id: HomeId;
  layoutVersion: 2;
  sections: SectionState[];
  widgets: WidgetState[];
  createdAt?: string;
  updatedAt?: string;
}

export type HomeDoc = HomeDocV1 | HomeDocV2;
export type HomeDocAny = HomeDoc; // for migration gate