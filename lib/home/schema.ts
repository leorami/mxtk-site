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


