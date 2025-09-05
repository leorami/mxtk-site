import { NextResponse } from 'next/server';
import { loadJourney, saveJourney, JourneyDoc } from '@/lib/ai/store/fileStore';
import { redactPII } from '@/lib/ai/redact';

export const runtime = 'nodejs';

export async function GET(_: Request, context: any) {
  const { id } = context.params;
  const doc = await loadJourney(id);
  if (!doc) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true, journey: doc });
}

export async function PUT(req: Request, context: any) {
  const { id } = context.params;
  const body = await req.json();
  const doc = body.journey as JourneyDoc;
  
  if (!doc || doc.id !== id) {
    return NextResponse.json({ ok: false, error: 'bad payload' }, { status: 400 });
  }
  
  // Redact PII before saving
  doc.blocks = doc.blocks.map(b => ({
    ...b,
    body: redactPII(b.body)
  }));
  
  await saveJourney(doc);
  return NextResponse.json({ ok: true });
}
