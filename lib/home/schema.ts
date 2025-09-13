import { z } from 'zod';

// Accept both legacy and current widget type identifiers
const zKnownWidgetType = z.enum([
  // Legacy identifiers
  'getting-started',
  'custom-note',
  'resource-list',
  // Current identifiers (match lib/home/types.ts)
  'whats-next',
  'recent-answers',
  'glossary-spotlight',
  'note',
  'resources',
  'pools-mini',
  'price-mini',
]);
export const zWidgetType = z.union([zKnownWidgetType, z.string()])

export const zSize = z.object({ w: z.number().int().min(1), h: z.number().int().min(1) });
export const zPos = z.object({ x: z.number().int().min(0), y: z.number().int().min(0) });

export const zWidgetState = z.object({
  id: z.string().min(1),
  type: zWidgetType,
  title: z.string().min(1).optional(),
  size: zSize,
  pos: zPos,
  pinned: z.boolean().optional(),
  data: z.record(z.unknown()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const zHomeDoc = z.object({
  id: z.string().min(1),
  widgets: z.array(zWidgetState),
  layoutVersion: z.literal(2),
});

export const zWidgetAddRequest = z.object({
  homeId: z.string().min(1).optional(),
  widget: z.object({
    type: zWidgetType,
    title: z.string().optional(),
    data: z.record(z.unknown()).optional(),
    size: zSize.optional(),
  }),
});

export function safeParseHome(input: unknown) {
  return zHomeDoc.safeParse(input);
}

export function safeParseWidgetAdd(input: unknown) {
  return zWidgetAddRequest.safeParse(input);
}


// Wave 12.2: PATCH schemas for partial widget updates (batch-friendly)
export const zWidgetPatch = z.object({
  id: z.string().min(1),
  size: z.object({ w: z.number().int().min(1).max(12), h: z.number().int().min(1).max(24) }).optional(),
  pos: z.object({ x: z.number().int().min(0).max(11), y: z.number().int().min(0).max(2000) }).optional(),
  pinned: z.boolean().optional(),
  data: z.record(z.unknown()).optional(),
  // allow removal for undo of adapt-added widgets
  remove: z.boolean().optional(),
}).refine(v => v.size || v.pos || typeof v.pinned === 'boolean' || v.data || v.remove === true, { message: 'No changes provided' });

// W12.5b: section patch (collapsed/order)
export const zSectionPatch = z.object({
  id: z.string(),
  collapsed: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const zHomePatch = z.object({
  widgets: z.array(zWidgetPatch).optional(),
  sections: z.array(zSectionPatch).optional(),
}).refine(v => (v.widgets && v.widgets.length) || (v.sections && v.sections.length), { message: 'No changes provided' });
export type HomePatch = z.infer<typeof zHomePatch>;

