/* server-only; file-backed Journey store */
import fs from 'node:fs/promises';
import path from 'node:path';

export type JourneyBlock = {
  id: string;
  topicKey: string;
  section: 'overview' | 'how-it-works' | 'risks' | 'tokenomics' | 'validation' | 'faq' | 'glossary' | 'resources';
  title: string;
  body: string;
  citations: string[];
  confidence?: number;
  pinned?: boolean;
};

export type JourneyDoc = {
  id: string;
  createdAt: string;
  updatedAt: string;
  blocks: JourneyBlock[];
  meta?: { lastLevel?: 'learn' | 'build' | 'operate' };
};

const baseDir = process.env.AI_VECTOR_DIR || './ai_store';
const journeysDir = path.join(process.cwd(), baseDir, 'journeys');

async function ensure() {
  await fs.mkdir(journeysDir, { recursive: true });
}

export async function loadJourney(id: string) {
  await ensure();
  try {
    const p = path.join(journeysDir, `${id}.json`);
    return JSON.parse(await fs.readFile(p, 'utf8')) as JourneyDoc;
  } catch {
    return null;
  }
}

export async function saveJourney(doc: JourneyDoc) {
  await ensure();
  const p = path.join(journeysDir, `${doc.id}.json`);
  doc.updatedAt = new Date().toISOString();
  await fs.writeFile(p, JSON.stringify(doc, null, 2), 'utf8');
}

export type StoredChunk = { id: string; text: string; meta: any; embedding?: number[]; quarantined?: boolean };
