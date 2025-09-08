import ToolsPanel from '@/components/admin/ToolsPanel';
import { cookies } from 'next/headers';
import Link from 'next/link';
import 'server-only';

async function getStatus() {
    const res = await fetch(new URL(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/ai/vector/status`, 'http://localhost:2000').toString(), { cache: 'no-store' }).catch(() => null as any);
    try { return await res.json(); } catch { return { ok: false }; }
}

export default async function AdminTools() {
    const ck = await cookies();
    const authed = ck.get('mxtk_admin')?.value === '1';
    const status = await getStatus();
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Admin Tools</h1>
            {!authed ? (
                <p className="text-sm opacity-80">Please sign in on <Link href="/admin" className="underline">/admin</Link>.</p>
            ) : (
                <ToolsPanel />
            )}
            <section className="rounded-xl border p-4">
                <h2 className="font-semibold mb-2">Home Testing</h2>
                <p className="text-sm opacity-80">Use Sherpa with mode “learn” to auto-append summaries to the user Home. Visit <Link href="/home" className="underline">Home</Link> to verify widgets.</p>
            </section>
        </div>
    );
}


