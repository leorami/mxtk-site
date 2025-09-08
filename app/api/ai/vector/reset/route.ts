import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

function authed(req: NextRequest) {
    const t = req.headers.get('authorization') || '';
    const admin = process.env.ADMIN_TOKEN || 'dev';
    if (t === 'Bearer ' + admin) return true;
    const adminCookie = req.cookies.get('mxtk_admin')?.value;
    return adminCookie === '1';
}

export async function POST(req: NextRequest) {
    if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const base = process.env.AI_VECTOR_DIR || './ai_store';
    const chunksPath = path.join(process.cwd(), base, 'chunks.json');
    const embedsPath = path.join(process.cwd(), base, 'embeddings.json');
    await fs.mkdir(path.join(process.cwd(), base), { recursive: true });
    await Promise.allSettled([fs.unlink(chunksPath), fs.unlink(embedsPath)]);
    return NextResponse.json({ ok: true });
}


