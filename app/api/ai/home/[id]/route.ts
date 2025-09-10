import { isV2, toV2 } from '@/lib/home/migrate';
import { getHomeDoc, saveHomeDoc } from '@/lib/home/store/fileStore'; // your existing fileStore
import type { HomeDocV2 } from '@/lib/home/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const doc = await getHomeDoc(params.id);
  const migrated = toV2(doc);

  if (!isV2(doc)) {
    await saveHomeDoc(migrated);           // write migration once
  }
  return NextResponse.json(migrated);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const payload = await req.json() as Partial<HomeDocV2>;
  const doc = toV2(await getHomeDoc(params.id));
  const next: HomeDocV2 = { ...doc, ...payload };
  await saveHomeDoc(next);
  return NextResponse.json({ ok: true });
}