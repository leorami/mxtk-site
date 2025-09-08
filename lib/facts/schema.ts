import { z } from 'zod';
import type { FactsDoc } from './types';

// Apply length validations before/after transform using refine to allow trimming
const zStringTrimmed = z
  .string()
  .max(512, 'String too long')
  .transform((s) => s.trim());
const zNonEmptyTrimmed = z
  .string()
  .max(512, 'String too long')
  .transform((s) => s.trim())
  .refine((s) => s.length >= 1, 'Required');

const zUrlString = z.string().url().max(2048);

const zNonNegativeNumber = z.number().finite().nonnegative();

const zStringArray = z.array(zStringTrimmed).max(100);

export const zFactsData = z.object({
  project: z.object({
    name: zNonEmptyTrimmed,
    tagline: zStringTrimmed.optional(),
  }),
  assets: z
    .object({
      committedUSD: zNonNegativeNumber.optional(),
      categories: zStringArray.optional(),
    })
    .optional(),
  governance: z
    .object({
      policyUrl: zUrlString.optional(),
      contact: zStringTrimmed.optional(),
    })
    .optional(),
  models: z
    .object({
      suggest: zStringArray.optional(),
      answer: zStringArray.optional(),
      deep: zStringArray.optional(),
      embeddings: zStringTrimmed.optional(),
    })
    .optional(),
  // Record keys cannot be effects; keep keys as plain strings with limits
  links: z.record(z.string().min(1).max(64), zUrlString).optional(),
  misc: z.record(z.string(), z.unknown()).optional(),
});

export const zFactsDoc = z.object({
  version: z.number().int().gte(1),
  updatedAt: z.number().int().gte(0),
  etag: zStringTrimmed.optional(),
  data: zFactsData,
});

export function parseFacts(doc: unknown): FactsDoc {
  const parsed = zFactsDoc.safeParse(doc);
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Invalid FactsDoc: ${message}`);
  }
  return parsed.data as FactsDoc;
}

export function sanitizeFacts(doc: unknown): FactsDoc {
  // zod transforms applied in schema handle trimming; this will throw on invalid
  return parseFacts(doc);
}


