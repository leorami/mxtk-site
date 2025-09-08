import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { FactsDoc } from './types';
import { sanitizeFacts } from './schema';

export const FACTS_PATH = 'ai_store/facts.json';

function ensureDirExistsSync(targetPath: string) {
  const dir = path.dirname(targetPath);
  // Best-effort create; ignore if exists
  return fs.mkdir(dir, { recursive: true }).catch(() => {});
}

function stableStringify(value: unknown): string {
  const seen = new WeakSet();
  function stringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (seen.has(obj)) {
      throw new TypeError('Converting circular structure to JSON');
    }
    seen.add(obj);
    if (Array.isArray(obj)) {
      return '[' + obj.map((v) => stringify(v)).join(',') + ']';
    }
    const keys = Object.keys(obj).sort();
    const entries = keys.map((k) => JSON.stringify(k) + ':' + stringify(obj[k]));
    return '{' + entries.join(',') + '}';
  }
  return stringify(value);
}

export function computeEtag(doc: FactsDoc): string {
  const json = stableStringify({ version: doc.version, updatedAt: doc.updatedAt, data: doc.data });
  const hash = crypto.createHash('sha256').update(json).digest('hex');
  // Strong ETag wrapped in quotes for HTTP
  return '"' + hash + '"';
}

export function bumpVersion(prev: FactsDoc): FactsDoc {
  const next: FactsDoc = {
    version: (prev.version || 0) + 1,
    updatedAt: Date.now(),
    data: prev.data,
  };
  return next;
}

export async function getFacts(filePath: string = FACTS_PATH): Promise<FactsDoc> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return sanitizeFacts(parsed);
  } catch (err: any) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) {
      // Missing file: return minimal default, but do not write
      return {
        version: 1,
        updatedAt: Date.now(),
        data: { project: { name: 'MXTK' } },
      };
    }
    throw err;
  }
}

export async function putFacts(next: FactsDoc, filePath: string = FACTS_PATH): Promise<void> {
  await ensureDirExistsSync(filePath);
  const tmp = filePath + '.tmp-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  const json = JSON.stringify(next, null, 2) + '\n';
  // Write temp file, then atomically rename
  await fs.writeFile(tmp, json, 'utf8');
  await fs.rename(tmp, filePath);
}


