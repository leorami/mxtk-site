// lib/home/migrate.ts
import type { HomeDoc, SectionState, WidgetState } from './types';

const DEFAULT_SECTIONS: SectionState[] = [
  { id: 'overview',      key: 'overview',      title: 'Overview',    order: 0 },
  { id: 'mxtk-info-1',   key: 'mxtk-info-1',   title: 'MXTK-Info-1', order: 1 },
  { id: 'learn',         key: 'learn',         title: 'Training',    order: 2 },
  { id: 'mxtk-info-2',   key: 'mxtk-info-2',   title: 'MXTK-Info-2', order: 3 },
  { id: 'build',         key: 'build',         title: 'Preparing',   order: 4 },
  { id: 'mxtk-info-3',   key: 'mxtk-info-3',   title: 'MXTK-Info-3', order: 5 },
  { id: 'operate',       key: 'operate',       title: 'Conquering',  order: 6 },
  { id: 'library',       key: 'library',       title: 'Library',     order: 7 },
  { id: 'mxtk-footer',   key: 'mxtk-footer',   title: 'MXTK-Footer', order: 8 },
];

function coerceInt(n: any, fallback: number) {
  const x = Number.isFinite(Number(n)) ? Number(n) : fallback;
  return x > 0 ? x : fallback;
}

export function migrateToV2(input: any): { doc: HomeDoc; migrated: boolean } {
  if (!input || typeof input !== 'object') {
    // brand new
    const fresh: HomeDoc = { id: 'default', layoutVersion: 2, sections: DEFAULT_SECTIONS, widgets: [] };
    return { doc: fresh, migrated: true };
  }

  // Already V2 with sections?
  if ((Number(input.layoutVersion) === 2 || Number(input.version) === 2) && Array.isArray(input.sections)) {
    // Ensure we're using layoutVersion and merge in any missing default sections
    const fixedInput = { ...input };
    if (fixedInput.version && !fixedInput.layoutVersion) {
      fixedInput.layoutVersion = fixedInput.version;
      delete fixedInput.version;
    }
    const present = new Set<string>(fixedInput.sections.map((s: any) => String(s.id)))
    const merged: SectionState[] = [...fixedInput.sections]
    for (const def of DEFAULT_SECTIONS) {
      if (!present.has(def.id)) merged.push({ ...def })
    }
    // Reindex order to maintain visual layout; keep existing orders for present items
    merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    return { doc: { ...(fixedInput as HomeDoc), sections: merged }, migrated: false };
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
    layoutVersion: 2,
    sections: DEFAULT_SECTIONS,
    widgets,
  };

  return { doc, migrated: true };
}