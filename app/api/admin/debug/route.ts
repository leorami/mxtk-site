import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

function digest(v: string) {
    try { return crypto.createHash('sha256').update(v).digest('hex'); } catch { return ''; }
}

export async function GET() {
    const a = (process.env.MXTK_ADMIN_TOKEN || '').trim();
    const b = (process.env.ADMIN_TOKEN || '').trim();
    const c = (process.env.NEXT_PUBLIC_ADMIN_TOKEN || '').trim();
    return NextResponse.json({
        ok: true,
        MXTK_ADMIN_TOKEN: { present: !!a, length: a.length, sha256: a ? digest(a).slice(0, 12) : '' },
        ADMIN_TOKEN: { present: !!b, length: b.length, sha256: b ? digest(b).slice(0, 12) : '' },
        NEXT_PUBLIC_ADMIN_TOKEN: { present: !!c, length: c.length, sha256: c ? digest(c).slice(0, 12) : '' },
    }, { headers: { 'Cache-Control': 'no-store' } });
}


