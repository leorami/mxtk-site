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
    // Overview
    { section: 'overview', type: 'whats-next',       title: "What's Next",     size: { w: 4, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'recent-answers',   title: 'Recent Answers',   size: { w: 4, h: 24 }, pos: { x: 4, y: 0 } },
    { section: 'overview', type: 'note',             title: 'Note',             size: { w: 4, h: 24 }, pos: { x: 8, y: 0 }, data: { note: '' } },
    { section: 'overview', type: 'pools-mini',       title: 'Top Pools',        size: { w: 3, h: 20 }, pos: { x: 0, y: 24 }, data: { token: (process.env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba') } },
    { section: 'overview', type: 'price-mini',       title: 'Gold (XAU) Price', size: { w: 3, h: 20 }, pos: { x: 3, y: 24 }, data: { symbol: 'XAU', days: 7 as any } },
    // Learn
    { section: 'learn',    type: 'resources',        title: 'Learn Resources',  size: { w: 6, h: 20 }, pos: { x: 0, y: 0 }, data: { maxItems: 6 } },
    { section: 'learn',    type: 'glossary-spotlight', title: 'Glossary',      size: { w: 6, h: 20 }, pos: { x: 6, y: 0 } },
    // Library
    { section: 'library',  type: 'resources',        title: 'Documentation',    size: { w: 12, h: 18 }, pos: { x: 0, y: 40 }, data: { maxItems: 10 } },
  ],

  build: [
    // Overview
    { section: 'overview', type: 'whats-next',       title: "What's Next",     size: { w: 4, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'recent-answers',   title: 'Recent Answers',   size: { w: 4, h: 24 }, pos: { x: 4, y: 0 } },
    { section: 'overview', type: 'note',             title: 'Note',             size: { w: 4, h: 24 }, pos: { x: 8, y: 0 }, data: { note: '' } },
    { section: 'overview', type: 'pools-mini',       title: 'Top Pools',        size: { w: 3, h: 20 }, pos: { x: 0, y: 24 }, data: { token: (process.env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba') } },
    { section: 'overview', type: 'price-mini',       title: 'Gold (XAU) Price', size: { w: 3, h: 20 }, pos: { x: 3, y: 24 }, data: { symbol: 'XAU', days: 7 as any } },
    // Build
    { section: 'build',    type: 'resources',        title: 'Builder Resources', size: { w: 6, h: 20 }, pos: { x: 0, y: 0 }, data: { category: 'dev', maxItems: 6 } as any },
    { section: 'build',    type: 'pools-mini',       title: 'Pools',            size: { w: 6, h: 20 }, pos: { x: 6, y: 0 }, data: { token: (process.env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba') } },
    // Library
    { section: 'library',  type: 'resources',        title: 'Documentation',    size: { w: 12, h: 18 }, pos: { x: 0, y: 40 }, data: { maxItems: 10 } },
  ],

  operate: [
    // Overview
    { section: 'overview', type: 'whats-next',       title: "What's Next",     size: { w: 4, h: 24 }, pos: { x: 0, y: 0 } },
    { section: 'overview', type: 'recent-answers',   title: 'Recent Answers',   size: { w: 4, h: 24 }, pos: { x: 4, y: 0 } },
    { section: 'overview', type: 'note',             title: 'Note',             size: { w: 4, h: 24 }, pos: { x: 8, y: 0 }, data: { note: '' } },
    { section: 'overview', type: 'pools-mini',       title: 'Top Pools',        size: { w: 3, h: 20 }, pos: { x: 0, y: 24 }, data: { token: (process.env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba') } },
    { section: 'overview', type: 'price-mini',       title: 'Gold (XAU) Price', size: { w: 3, h: 20 }, pos: { x: 3, y: 24 }, data: { symbol: 'XAU', days: 30 as any } },
    // Operate
    { section: 'operate',  type: 'resources',        title: 'Ops Runbook',      size: { w: 6, h: 20 }, pos: { x: 0, y: 0 }, data: { category: 'inst', maxItems: 6 } as any },
    { section: 'operate',  type: 'price-mini',       title: 'XAU 30d',          size: { w: 6, h: 20 }, pos: { x: 6, y: 0 }, data: { symbol: 'XAU', days: 30 as any } },
    // Library
    { section: 'library',  type: 'resources',        title: 'Documentation',    size: { w: 12, h: 18 }, pos: { x: 0, y: 40 }, data: { maxItems: 10 } },
  ],
};


