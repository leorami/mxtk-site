import { type Flag, type FlagCategory, type FlagStatus } from '@/lib/ai/govern/types';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AI_VECTOR_DIR || './ai_store';
const flagsDir = path.join(process.cwd(), base, 'flags');
const governDir = path.join(process.cwd(), base, 'govern');
const flagsLog = path.join(governDir, 'flags.jsonl');
const reviewsLog = path.join(governDir, 'reviews.jsonl');
const indexPath = path.join(governDir, 'index.json');

async function ensure() {
  await fs.mkdir(flagsDir, { recursive: true });
  await fs.mkdir(governDir, { recursive: true });
}

export async function readJson<T>(p: string, d: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8')) as T;
  } catch {
    return d;
  }
}

export async function writeJson(p: string, v: any) {
  await fs.writeFile(p, JSON.stringify(v, null, 2), 'utf8');
}

export async function getPending() {
  await ensure();
  return readJson(path.join(flagsDir, 'pending.json'), [] as any[]);
}

export async function setPending(v: any[]) {
  await ensure();
  return writeJson(path.join(flagsDir, 'pending.json'), v);
}

export async function getDecided() {
  await ensure();
  return readJson(path.join(flagsDir, 'decided.json'), [] as any[]);
}

export async function setDecided(v: any[]) {
  await ensure();
  return writeJson(path.join(flagsDir, 'decided.json'), v);
}

export async function upsertPending(entry: any) {
  const list = await getPending();
  const i = list.findIndex((x: any) => x.id === entry.id);
  if (i >= 0) list[i] = entry;
  else list.unshift(entry);
  await setPending(list);
}


// === Governance JSONL-backed store ===

type IndexRecord = {
  id: string;
  createdAt: number;
  updatedAt?: number;
  status: FlagStatus;
  category?: FlagCategory;
  severity?: 1 | 2 | 3;
  journeyId?: string;
  messageId?: string;
  reason: string;
  labels?: string[];
};

async function atomicAppend(filePath: string, line: string) {
  await ensure();
  // Append with fs.appendFile is already atomic on POSIX for single writes
  await fs.appendFile(filePath, line + '\n', 'utf8');
}

async function atomicWriteJSON(filePath: string, obj: unknown) {
  await ensure();
  const tmp = filePath + '.tmp-' + crypto.randomUUID();
  await fs.writeFile(tmp, JSON.stringify(obj, null, 2), 'utf8');
  await fs.rename(tmp, filePath);
}

async function readJsonl(filePath: string): Promise<any[]> {
  await ensure();
  const exists = await fs
    .stat(filePath)
    .then(() => true)
    .catch(() => false);
  if (!exists) return [];
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split(/\n+/).filter(Boolean);
  return lines.map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

async function rebuildIndex(): Promise<void> {
  const flags = (await readJsonl(flagsLog)) as Flag[];
  const byId = new Map<string, Flag>();
  for (const f of flags) byId.set(f.id, f);
  const index: IndexRecord[] = Array.from(byId.values()).map((f) => ({
    id: f.id,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
    status: f.status,
    category: f.category,
    severity: f.severity,
    journeyId: f.journeyId,
    messageId: f.messageId,
    reason: f.reason,
    labels: f.labels,
  }));
  await atomicWriteJSON(indexPath, { items: index, builtAt: Date.now() });
}

export async function createFlag(input: Omit<Flag, 'id' | 'createdAt' | 'status'> & { status?: never }): Promise<Flag> {
  await ensure();
  const now = Date.now();
  const flag: Flag = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    status: 'open',
    notes: input.notes || [],
    labels: input.labels || [],
  };
  await atomicAppend(flagsLog, JSON.stringify(flag));
  await rebuildIndex();
  return flag;
}

export async function putFlag(flag: Flag): Promise<void> {
  await atomicAppend(flagsLog, JSON.stringify(flag));
  await rebuildIndex();
}

export async function getFlag(id: string): Promise<Flag | null> {
  const indexExists = await fs
    .stat(indexPath)
    .then(() => true)
    .catch(() => false);
  if (!indexExists) await rebuildIndex();
  const idx = JSON.parse(await fs.readFile(indexPath, 'utf8')) as { items: IndexRecord[] };
  const hit = (idx.items || []).find((x) => x.id === id);
  if (!hit) return null;
  // Walk jsonl to get the latest snapshot for this id
  const flags = (await readJsonl(flagsLog)) as Flag[];
  for (let i = flags.length - 1; i >= 0; i--) {
    if (flags[i].id === id) return flags[i];
  }
  return null;
}

export async function getFlags(params: { status?: FlagStatus; category?: FlagCategory; q?: string; limit?: number; cursor?: string }) {
  const { status, category, q, limit = 50, cursor } = params || {};
  const indexExists = await fs
    .stat(indexPath)
    .then(() => true)
    .catch(() => false);
  if (!indexExists) await rebuildIndex();
  const idx = JSON.parse(await fs.readFile(indexPath, 'utf8')) as { items: IndexRecord[] };
  let items = idx.items || [];
  if (status) items = items.filter((i) => i.status === status);
  if (category) items = items.filter((i) => i.category === category);
  if (q && q.trim()) {
    const qq = q.toLowerCase();
    items = items.filter((i) => (i.reason || '').toLowerCase().includes(qq));
  }
  // sort by createdAt desc
  items = items.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
  let start = 0;
  if (cursor) {
    const idxPos = items.findIndex((i) => i.id === cursor);
    if (idxPos >= 0) start = idxPos + 1;
  }
  const page = items.slice(start, start + limit);
  const nextCursor = page.length === limit ? page[page.length - 1].id : undefined;
  return { items: page, nextCursor };
}

export type ReviewEvent = {
  id: string;
  flagId: string;
  at: number;
  actor: string;
  action: 'resolve' | 'dismiss' | 'escalate' | 'reopen' | 'annotate';
  payload?: { category?: FlagCategory; note?: string; labels?: string[] };
};

export async function appendReview(ev: ReviewEvent): Promise<void> {
  await atomicAppend(reviewsLog, JSON.stringify(ev));
}

export async function listReviews(flagId: string): Promise<ReviewEvent[]> {
  const items = (await readJsonl(reviewsLog)) as ReviewEvent[];
  return items.filter((e) => e.flagId === flagId).sort((a, b) => a.at - b.at);
}



