"use client";
import { useState } from 'react';
import { apiPost } from '@/lib/api';
import Link from 'next/link';

export default function AddToHomeButton({ kind = 'getting-started' as 'getting-started' | 'recent-answers' }){
  const [result, setResult] = useState<{ homeId?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function add(){
    if (busy) return; setBusy(true);
    try {
      const res = await apiPost('/ai/home/add', { widget: { type: kind } });
      setResult(res as any);
    } catch {
    } finally { setBusy(false); }
  }
  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={add} disabled={busy} className="btn btn-sm" aria-label="Add to Home">Add to Home</button>
      {result?.homeId && (
        <Link href="/home" className="text-sm underline">Open Home</Link>
      )}
    </div>
  );
}

"use client";
import { getApiPath } from '@/lib/basepath';
import { useEffect } from 'react';

export default function AddToHomeButton({ widget }:{ widget:{ type:string; title?:string; data?:any } }){
  async function add(){ try { await fetch(getApiPath('/api/ai/home/add'),{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ widget }) }); } catch {} finally { try { window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Added to Home' } })) } catch {} } }
  useEffect(()=>{
    const h=(e:Event)=>{ const d=(e as CustomEvent).detail; if(d?.widget){ fetch(getApiPath('/api/ai/home/add'),{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ widget:d.widget }) }); } };
    window.addEventListener('mxtk:home:add', h as EventListener);
    return ()=>window.removeEventListener('mxtk:home:add', h as EventListener);
  },[]);
  return (<button onClick={add} className="inline-flex items-center gap-1 text-xs rounded px-2 py-1 bg-ink-900 text-white">+ Home</button>);
}


