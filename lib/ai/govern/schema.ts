import type { FlagStatus } from '@/lib/ai/govern/types';
import { z } from 'zod';

const MAX_STR = 2000;

export const zFlagStatus = z.enum(['open', 'reviewing', 'resolved', 'dismissed', 'escalated'] satisfies FlagStatus[]);

export const zFlagCategory = z.enum([
  'pii',
  'policy',
  'prompt-injection',
  'spam',
  'abuse',
  'hallucination',
  'cost-anomaly',
  'other',
]);

export const zFlag = z
  .object({
    id: z.string().min(1),
    createdAt: z.number().int().nonnegative(),
    journeyId: z.string().min(1).optional(),
    messageId: z.string().min(1).optional(),
    source: z.enum(['chat', 'ingest', 'system']),
    category: zFlagCategory.optional(),
    reason: z.string().min(1).max(MAX_STR),
    severity: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    metadata: z.record(z.unknown()).optional(),
    status: zFlagStatus,
    notes: z.array(z.string().min(1).max(MAX_STR)).optional(),
    labels: z.array(z.string().min(1).max(64)).optional(),
    reviewer: z.string().min(1).max(256).optional(),
    updatedAt: z.number().int().nonnegative().optional(),
  })
  .strict();

export const zReviewAction = z
  .object({
    id: z.string().min(1),
    flagId: z.string().min(1),
    at: z.number().int().nonnegative(),
    actor: z.string().min(1).max(256),
    action: z.enum(['resolve', 'dismiss', 'escalate', 'reopen', 'annotate']),
    payload: z
      .object({
        category: zFlagCategory.optional(),
        note: z.string().min(1).max(MAX_STR).optional(),
        labels: z.array(z.string().min(1).max(64)).optional(),
      })
      .partial()
      .optional(),
  })
  .strict();

export const zQuery = z
  .object({
    status: zFlagStatus.optional(),
    category: zFlagCategory.optional(),
    q: z.string().max(MAX_STR).optional(),
    limit: z.number().int().min(1).max(200).optional(),
    cursor: z.string().max(256).optional(),
  })
  .strict();

export const safeParseFlag = (v: unknown) => zFlag.safeParse(v);
export const safeParseReviewAction = (v: unknown) => zReviewAction.safeParse(v);
export const safeParseQuery = (v: unknown) => zQuery.safeParse(v);


