import fs from 'node:fs/promises';
import path from 'node:path';
import { deserialize, serialize } from '@/lib/home/pureStore';
import type { HomeDoc } from '@/lib/home/gridTypes';

const BASE_DIR = process.env.AI_VECTOR_DIR || './ai_store';
const HOMES_DIR = path.join(process.cwd(), BASE_DIR, 'homes');

async function ensure() {
  await fs.mkdir(HOMES_DIR, { recursive: true });
}

export async function getHome(id: string): Promise<HomeDoc | null> {
  await ensure();
  try {
    const p = path.join(HOMES_DIR, `${id}.json`);
    const txt = await fs.readFile(p, 'utf8');
    return deserialize(txt);
  } catch {
    return null;
  }
}

export async function putHome(doc: HomeDoc): Promise<HomeDoc> {
  await ensure();
  const p = path.join(HOMES_DIR, `${doc.id}.json`);
  const tmp = `${p}.tmp`;
  const payload = serialize(doc);
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, p);
  return doc;
}

export async function ensureHome(id: string): Promise<HomeDoc> {
  const existing = await getHome(id);
  if (existing) return existing;
  const empty: HomeDoc = { id, widgets: [], layoutVersion: 1 };
  await putHome(empty);
  return empty;
}


