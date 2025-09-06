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


