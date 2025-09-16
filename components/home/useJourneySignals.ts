"use client";
export function sendJourney(e:any){
  try {
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(e)], { type: 'application/json' });
      const ok = (navigator as any).sendBeacon('/api/telemetry/journey', blob);
      if (ok) return;
    }
  } catch {}
  try {
    if (typeof fetch !== 'undefined') {
      void fetch('/api/telemetry/journey', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e), keepalive: true }).catch(()=>{});
      return;
    }
  } catch {}
  try {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback?.(()=>fetch('/api/telemetry/journey', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e), keepalive: true }).catch(()=>{}));
      return;
    }
  } catch {}
  setTimeout(()=>{ try { fetch('/api/telemetry/journey', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e), keepalive: true }).catch(()=>{}); } catch {} }, 0);
}


