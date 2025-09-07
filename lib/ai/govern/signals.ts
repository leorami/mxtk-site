import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { z } from 'zod';
import { zFlagCategory } from '@/lib/ai/govern/schema';

const base = process.env.AI_VECTOR_DIR || './ai_store';
const governDir = path.join(process.cwd(), base, 'govern');
const signalsLog = path.join(governDir, 'signals.jsonl');

async function ensure() {
  await fs.mkdir(governDir, { recursive: true });
}

const MAX_NOTE = 2000;

export const zSignal = z
  .object({
    flagId: z.string().min(1),
    at: z.number().int().nonnegative(),
    labelSet: z.array(z.string().min(1).max(64)).nonempty(),
    category: zFlagCategory.optional(),
    severity: z.number().int().min(1).max(3).optional(),
    note: z.string().max(MAX_NOTE).optional(),
    journeyId: z.string().optional(),
    messageId: z.string().optional(),
  })
  .strict();

export type Signal = z.infer<typeof zSignal> & { id: string };

async function atomicAppend(filePath: string, line: string) {
  await ensure();
  await fs.appendFile(filePath, line + '\n', 'utf8');
}

export async function recordSignal(input: z.infer<typeof zSignal>): Promise<Signal> {
  await ensure();
  const sig: Signal = {
    ...input,
    note: input.note ? (input.note.length > MAX_NOTE ? input.note.slice(0, MAX_NOTE) : input.note) : undefined,
    id: crypto.randomUUID(),
  };
  await atomicAppend(signalsLog, JSON.stringify(sig));
  return sig;
}

export async function getSignals(params: { since?: number; limit?: number }) {
  await ensure();
  const exists = await fs
    .stat(signalsLog)
    .then(() => true)
    .catch(() => false);
  if (!exists) return { items: [] as Signal[] };
  const content = await fs.readFile(signalsLog, 'utf8');
  const lines = content.split(/\n+/).filter(Boolean);
  let items = lines.map((l) => JSON.parse(l) as Signal);
  if (params.since) items = items.filter((s) => s.at >= params.since!);
  items = items.sort((a, b) => b.at - a.at);
  const limit = params.limit ?? 200;
  return { items: items.slice(0, limit) };
}


