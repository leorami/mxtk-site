import type { HomeDocV1, HomeDoc, SectionKey, SectionState } from "./types";
const MIN_W = 3, MIN_H = 4;

export function isV2(doc: HomeDoc): doc is HomeDoc & { layoutVersion: 2 } {
  return doc.layoutVersion === 2 && Array.isArray((doc as any).sections);
}

export function toV2(doc: HomeDocV1): HomeDoc {
  // If already V2, return as is
  if (isV2(doc)) return doc as any;
  
  const sections: SectionState[] = [
    { id: "s-overview", key: "overview" as SectionKey, title: "Overview", order: 0 },
    { id: "s-learn",    key: "learn" as SectionKey,    title: "Learn",    order: 1 },
    { id: "s-build",    key: "build" as SectionKey,    title: "Build",    order: 2 },
    { id: "s-operate",  key: "operate" as SectionKey,  title: "Operate",  order: 3 },
    { id: "s-library",  key: "library" as SectionKey,  title: "Library",  order: 4 },
  ];
  
  return {
    id: doc.id,
    layoutVersion: 2,
    sections,
    widgets: doc.widgets.map(w => ({
      ...w,
      sectionId: w.sectionId || "s-overview",
      size: { w: Math.max(w.size?.w ?? MIN_W, MIN_W), h: Math.max(w.size?.h ?? MIN_H, MIN_H) },
      pos: { x: Math.max(0, w.pos?.x ?? 0), y: Math.max(0, w.pos?.y ?? 0) },
    })),
  };
}