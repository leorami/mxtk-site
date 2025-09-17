"use client";
import { getApiPath } from '@/lib/basepath';

export function sendJourney(e:any){
  const url = getApiPath('/api/telemetry/journey')
  try {
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(e)], { type: 'application/json' });
      const ok = (navigator as any).sendBeacon(url, blob);
      if (ok) return;
    }
  } catch {}
  try {
    if (typeof fetch !== 'undefined') {
      void fetch(url, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e), keepalive: true }).catch(()=>{});
      return;
    }
  } catch {}
  try {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback?.(()=>fetch(url, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e), keepalive: true }).catch(()=>{}));
      return;
    }
  } catch {}
  setTimeout(()=>{ try { fetch(url, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e), keepalive: true }).catch(()=>{}); } catch {} }, 0);
}


