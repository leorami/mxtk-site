import fs from 'node:fs/promises';
import path from 'node:path';

export type FlagResult = { risk: number; reasons: string[]; labels: string[] };

const base = process.env.AI_VECTOR_DIR || './ai_store';
const feedbackPath = path.join(process.cwd(), base, 'flags_feedback.json');

async function loadSignals(): Promise<{ pos: string[]; neg: string[] }> {
  try {
    const raw = await fs.readFile(feedbackPath, 'utf8');
    return JSON.parse(raw) as { pos: string[]; neg: string[] };
  } catch {
    return { pos: [], neg: [] };
  }
}

export async function flagText(
  text: string,
  meta: { source?: string } = {}
): Promise<FlagResult> {
  const t = (text || '').toLowerCase();
  const reasons: string[] = [];
  let score = 0;
  const labels = new Set<string>();

  const hits = (rx: RegExp, s: string) => {
    const m = t.match(rx);
    if (m) {
      reasons.push(s + ` (${m[0]})`);
      return m.length;
    } else return 0;
  };

  // Heuristics
  score += 0.25 * (hits(/\b(confidential|proprietary|do not distribute|internal only|nda)\b/g, 'policy') > 0 ? 1 : 0);
  score += 0.25 * (hits(/\b(patent|claims|novel method|prior art|patentable)\b/g, 'patent') > 0 ? 1 : 0);
  score += 0.15 * (hits(/```|\bpragma\b|#include|function\s*\(|class\s+\w+/g, 'code-like') > 0 ? 1 : 0);
  score += 0.15 * (hits(/\b(api key|secret|private key|mnemonic)\b/g, 'secrets') > 0 ? 1 : 0);

  // Whitelist cues (public materials reduce score)
  const wl = /https?:\/\/|public\s+(site|docs|whitepaper)|press\s+release/gi;
  if (wl.test(t)) score -= 0.15;

  // Signals
  const sig = await loadSignals();
  for (const p of sig.pos) {
    if (p && t.includes(p.toLowerCase())) score += 0.05;
  }
  for (const n of sig.neg) {
    if (n && t.includes(n.toLowerCase())) score -= 0.05;
  }

  if (score < 0) score = 0;
  if (score > 1) score = 1;

  if (score >= 0.5) labels.add('needs-review');
  if (/patent|patentable|claims/.test(t)) labels.add('patent');

  return { risk: Number(score.toFixed(3)), reasons, labels: Array.from(labels) };
}


