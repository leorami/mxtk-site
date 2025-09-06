import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AI_VECTOR_DIR || './ai_store';
const flagsDir = path.join(process.cwd(), base, 'flags');

async function ensure() {
  await fs.mkdir(flagsDir, { recursive: true });
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


