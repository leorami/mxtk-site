// app/api/ai/home/_diag/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const cwd = process.cwd();
    const dir = path.join(cwd, 'ai_store', 'homes');
    await fs.mkdir(dir, { recursive: true });
    const testPath = path.join(dir, '__write_test.txt');
    await fs.writeFile(testPath, 'ok');
    const files = await fs.readdir(dir).catch(() => []);
    return NextResponse.json({ cwd, homesDir: dir, canWrite: true, files }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'diag-failed', detail: e?.stack || e?.message || String(e) },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}