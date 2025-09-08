import { z } from 'zod';

export const zWidgetType = z.enum([
  'getting-started',
  'recent-answers',
  'glossary-spotlight',
  'custom-note',
  'resource-list',
]);

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
  layoutVersion: z.literal(1),
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
}).refine(v => v.size || v.pos || typeof v.pinned === 'boolean' || v.data, { message: 'No changes provided' });

export const zHomePatch = z.object({ widgets: z.array(zWidgetPatch).min(1) });
export type HomePatch = z.infer<typeof zHomePatch>;

