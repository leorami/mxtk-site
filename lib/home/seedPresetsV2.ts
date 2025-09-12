// lib/home/seedPresetsV2.ts
// Experience-aware presets for Home V2 seeding/adaptation (no styling here)

import type { SectionKey, WidgetType } from './types';

export type PresetItem = {
  section: SectionKey;
  type: WidgetType;
  size: { w: number; h: number };
  pos: { x: number; y: number };
  title?: string;
  data?: Record<string, unknown>;
};

export const PRESETS_V2: Record<'learn' | 'build' | 'operate', PresetItem[]> = {
  learn: [
    // Overview: consistent core widgets
    { section: 'overview', type: 'whats-next',          title: "What's Next",    size: { w: 4, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'recent-answers',      title: 'Recent Answers',  size: { w: 4, h: 24 }, pos: { x: 4, y: 0 } },
    { section: 'overview', type: 'note',                title: 'Note',            size: { w: 4, h: 24 }, pos: { x: 8, y: 0 }, data: { note: '' } },

    // Learn-focused
    { section: 'learn',    type: 'glossary-spotlight',  title: 'Glossary',        size: { w: 6, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'learn',    type: 'resources',           title: 'Resources',       size: { w: 6, h: 24 }, pos: { x: 6, y: 0 } },
  ],

  build: [
    // Overview core
    { section: 'overview', type: 'whats-next',          title: "What's Next",    size: { w: 4, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'recent-answers',      title: 'Recent Answers',  size: { w: 4, h: 24 }, pos: { x: 4, y: 0 } },
    { section: 'overview', type: 'note',                title: 'Note',            size: { w: 4, h: 24 }, pos: { x: 8, y: 0 }, data: { note: '' } },

    // Build-focused
    { section: 'build',    type: 'resources',           title: 'Build Tasks',     size: { w: 6, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'build',    type: 'glossary-spotlight',  title: 'Key Concepts',    size: { w: 6, h: 24 }, pos: { x: 6, y: 0 } },
  ],

  operate: [
    // Overview core
    { section: 'overview', type: 'whats-next',          title: "What's Next",    size: { w: 4, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'recent-answers',      title: 'Recent Answers',  size: { w: 4, h: 24 }, pos: { x: 4, y: 0 } },
    { section: 'overview', type: 'note',                title: 'Note',            size: { w: 4, h: 24 }, pos: { x: 8, y: 0 }, data: { note: '' } },

    // Operate-focused
    { section: 'operate',  type: 'resources',           title: 'Runbook',         size: { w: 6, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'operate',  type: 'glossary-spotlight',  title: 'Terms To Know',   size: { w: 6, h: 24 }, pos: { x: 6, y: 0 } },
  ],
};


