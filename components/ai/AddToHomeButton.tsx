"use client";
import { apiPost } from '@/lib/api';
import { getApiPath } from '@/lib/basepath';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AddToHomeButton({ kind = 'getting-started' as 'getting-started' | 'recent-answers', widget }: { kind?: 'getting-started' | 'recent-answers'; widget?: { type: string; title?: string; data?: any } }){
  const [result, setResult] = useState<{ homeId?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function add(){
    if (busy) return; setBusy(true);
    try {
      const payload = widget || { type: kind };
      const res = await apiPost('/ai/home/add', { widget: payload });
      setResult(res as any);
      try { window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Added to Home' } })) } catch {}
    } catch {
    } finally { setBusy(false); }
  }

  useEffect(()=>{
    const h=(e:Event)=>{ const d=(e as CustomEvent).detail; if(d?.widget){ fetch(getApiPath('/api/ai/home/add'),{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ widget:d.widget }) }); } };
    try { window.addEventListener('mxtk:home:add', h as EventListener); } catch {}
    return ()=>{ try { window.removeEventListener('mxtk:home:add', h as EventListener) } catch {} };
  },[]);

  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={add} disabled={busy} className="btn btn-sm" aria-label="Add to Home">Add to Home</button>
      {result?.homeId && (
        <Link href="/home" className="text-sm underline">Open Home</Link>
      )}
    </div>
  );
}


