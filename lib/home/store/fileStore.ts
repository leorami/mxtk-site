// lib/home/store/fileStore.ts
import { promises as fs } from 'fs';
import path from 'path';
import type { HomeDoc } from '../types';

const ROOT = process.cwd();
const HOMES_DIR = path.join(ROOT, 'ai_store', 'homes');

async function ensureDir() {
  await fs.mkdir(HOMES_DIR, { recursive: true });
}

function homePath(id: string) {
  return path.join(HOMES_DIR, `${id}.json`);
}

export async function getHome(id: string): Promise<HomeDoc | null> {
  await ensureDir();
  const p = homePath(id);
  try {
    const buf = await fs.readFile(p);
    const txt = buf.toString('utf8').trim();
    if (!txt) { try { await fs.rename(p, p.replace(/\.json$/, `.bad.json`)); } catch {} ; return null; }
    return JSON.parse(txt) as HomeDoc;
  } catch (err: any) {
    if (err?.code === 'ENOENT') return null;
    try { await fs.rename(p, p.replace(/\.json$/, `.bad.json`)); } catch {}
    return null;
  }
}

export async function putHome(doc: HomeDoc): Promise<void> {
  await ensureDir();
  await fs.writeFile(homePath(doc.id), JSON.stringify(doc, null, 2));
}