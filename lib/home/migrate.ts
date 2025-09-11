// lib/home/migrate.ts
import type { HomeDoc, SectionState, WidgetState } from './types';

const DEFAULT_SECTIONS: SectionState[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'learn',    title: 'Learn' },
  { id: 'build',    title: 'Build' },
  { id: 'operate',  title: 'Operate' },
  { id: 'library',  title: 'Library' },
];

function coerceInt(n: any, fallback: number) {
  const x = Number.isFinite(Number(n)) ? Number(n) : fallback;
  return x > 0 ? x : fallback;
}

export function migrateToV2(input: any): { doc: HomeDoc; migrated: boolean } {
  if (!input || typeof input !== 'object') {
    // brand new
    const fresh: HomeDoc = { id: 'default', version: 2, sections: DEFAULT_SECTIONS, widgets: [] };
    return { doc: fresh, migrated: true };
  }

  // Already V2 with sections?
  if (Number(input.version) === 2 && Array.isArray(input.sections)) {
    return { doc: input as HomeDoc, migrated: false };
  }

  const id: string = input.id || 'default';
  const widgets: WidgetState[] = Array.isArray(input.widgets) ? input.widgets.map((w: any, i: number) => {
    const size = {
      w: coerceInt(w?.size?.w, 3),
      h: coerceInt(w?.size?.h, 24),
    };
    const pos = {
      x: coerceInt(w?.pos?.x, (i * 3) % 12),
      y: coerceInt(w?.pos?.y, Math.floor(i / 4) * 24),
    };
    return {
      id: String(w?.id || `w${i}`),
      type: String(w?.type || 'custom-note'),
      title: w?.title ?? undefined,
      size,
      pos,
      sectionId: String(w?.sectionId || 'overview'),
      pinned: !!w?.pinned,
      data: (w && w.data && typeof w.data === 'object') ? w.data : undefined,
    };
  }) : [];

  const doc: HomeDoc = {
    id,
    version: 2,
    sections: DEFAULT_SECTIONS,
    widgets,
  };

  return { doc, migrated: true };
}