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
    if (!txt) {
      // empty file—quarantine and treat as missing
      await fs.rename(p, p.replace(/\.json$/, `.bad.json`)).catch(() => {});
      return null;
    }
    const doc = JSON.parse(txt);
    return doc as HomeDoc;
  } catch (err: any) {
    if (err && (err.code === 'ENOENT')) return null; // not found → let caller 404
    // Corrupt JSON, quarantine it and surface as "missing"
    try { await fs.rename(p, p.replace(/\.json$/, `.bad.json`)); } catch {}
    return null;
  }
}

export async function putHome(doc: HomeDoc): Promise<void> {
  await ensureDir();
  const p = homePath(doc.id);
  const txt = JSON.stringify(doc, null, 2);
  await fs.writeFile(p, txt);
}