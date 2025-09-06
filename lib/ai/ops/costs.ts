import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AI_VECTOR_DIR || './ai_store';
const f = path.join(process.cwd(), base, 'costs.jsonl');

export type CostLine = {
  ts: string;
  kind: 'chat' | 'embed';
  model: string;
  tier?: string;
  tokens: { in: number; out: number };
  usd: number;
  route?: string;
};

export async function logCost(line: CostLine) {
  await fs.mkdir(path.dirname(f), { recursive: true });
  await fs.appendFile(f, JSON.stringify(line) + '\n', 'utf8');
}

export function estimateUSD(tokensIn: number, tokensOut: number, pricing?: { in: number; out: number }) {
  if (!pricing) return 0;
  return (tokensIn / 1000) * pricing.in + (tokensOut / 1000) * pricing.out;
}


