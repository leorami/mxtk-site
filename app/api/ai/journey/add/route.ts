import { NextRequest, NextResponse } from 'next/server';
import { addToJourney } from '@/lib/ai/journey';
import { redactPII } from '@/lib/ai/redact';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  
  if (!body || !body.block) {
    return NextResponse.json({ ok: false, error: 'missing block' }, { status: 400 });
  }
  
  // Redact PII before processing
  body.block.body = redactPII(body.block.body || '');
  
  const doc = await addToJourney(body.journeyId, body.block);
  return NextResponse.json({ ok: true, id: doc.id, journey: doc });
}
