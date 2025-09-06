import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AI_VECTOR_DIR || './ai_store';

(async () => {
  const src = path.join(process.cwd(), base, 'costs.jsonl');
  const dst = path.join(process.cwd(), base, 'costs_daily.json');
  let txt = '';
  try {
    txt = await fs.readFile(src, 'utf8');
  } catch {
    txt = '';
  }
  const lines = txt.trim() ? txt.trim().split(/\n+/) : [];
  const days: Record<string, { usd: number; calls: number }> = {};
  for (const l of lines) {
    try {
      const j = JSON.parse(l);
      const d = (j.ts || '').slice(0, 10);
      days[d] = days[d] || { usd: 0, calls: 0 };
      days[d].usd += Number(j.usd || 0);
      days[d].calls++;
    } catch {}
  }
  await fs.writeFile(dst, JSON.stringify(days, null, 2), 'utf8');
  console.log('Rollup complete');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});


