import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AI_VECTOR_DIR || './ai_store';

export async function getTodayUSD(): Promise<number> {
  try {
    const p = path.join(process.cwd(), base, 'costs_daily.json');
    const j = JSON.parse(await fs.readFile(p, 'utf8')) as Record<string, { usd: number }>;
    const k = new Date().toISOString().slice(0, 10);
    return Number((j[k]?.usd) || 0);
  } catch {
    return 0;
  }
}

export function getBudget(): { limit: number; mode: 'warn' | 'degrade' | 'block' } {
  return {
    limit: Number(process.env.COST_BUDGET_DAILY_USD || '0') || 0,
    mode: (process.env.COST_BUDGET_MODE || 'degrade') as 'warn' | 'degrade' | 'block',
  };
}


