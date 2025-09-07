import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { zFlag } from '@/lib/ai/govern/schema';
import { createFlag } from '@/lib/ai/govern/store';

export const runtime = 'nodejs';

const SeedItem = z.object({
  source: z.enum(['chat', 'ingest', 'system']),
  reason: z.string().min(1),
  category: z.union([
    z.literal('pii'),
    z.literal('policy'),
    z.literal('prompt-injection'),
    z.literal('spam'),
    z.literal('abuse'),
    z.literal('hallucination'),
    z.literal('cost-anomaly'),
    z.literal('other'),
  ]).optional(),
  severity: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  journeyId: z.string().optional(),
  messageId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  labels: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ ok: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  const body = await req.json().catch(() => ({}));
  const arr = Array.isArray(body) ? body : body.items;
  if (!Array.isArray(arr)) return NextResponse.json({ ok: false }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  if (arr.length > 50) return NextResponse.json({ ok: false, error: 'too many' }, { status: 429, headers: { 'Cache-Control': 'no-store' } });

  const created = [] as any[];
  for (const it of arr) {
    const p = SeedItem.safeParse(it);
    if (!p.success) continue;
    const f = await createFlag(p.data as any);
    created.push(f);
  }
  return NextResponse.json({ ok: true, items: created }, { headers: { 'Cache-Control': 'no-store' } });
}


