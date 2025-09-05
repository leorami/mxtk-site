import crypto from 'node:crypto';
import { JourneyBlock, JourneyDoc, loadJourney, saveJourney } from './store/fileStore';

export type Section = JourneyBlock['section'];

export function newJourneyId() {
  return crypto.randomBytes(8).toString('hex');
}

export function normalizeKey(s: string) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function mergeBlock(doc: JourneyDoc, block: JourneyBlock) {
  const i = doc.blocks.findIndex(b => b.topicKey === block.topicKey && b.section === block.section);
  if (i >= 0) {
    const prev = doc.blocks[i];
    const pinned = prev.pinned || block.pinned;
    const better = (block.confidence || 0) >= (prev.confidence || 0) ? block : prev;
    better.pinned = pinned;
    doc.blocks[i] = better;
  } else {
    doc.blocks.push(block);
  }
  doc.updatedAt = new Date().toISOString();
  return doc;
}

export async function addToJourney(journeyId: string | undefined, block: JourneyBlock) {
  const id = journeyId || newJourneyId();
  const existing = journeyId ? await loadJourney(id) : null;
  const doc: JourneyDoc = existing || {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: []
  };
  mergeBlock(doc, block);
  await saveJourney(doc);
  return doc;
}

export function blockFromAnswer(
  answer: string,
  citations: string[],
  opts: { title?: string; section?: Section; topicKey?: string; confidence?: number }
): JourneyBlock {
  const section = opts.section || 'overview';
  const title = opts.title || ((answer.split('\n').find(Boolean) || 'Answer').slice(0, 80));
  const topicKey = normalizeKey(opts.topicKey || title);
  
  return {
    id: crypto.randomUUID(),
    topicKey,
    section,
    title,
    body: answer,
    citations,
    confidence: opts.confidence ?? 0.7
  };
}
