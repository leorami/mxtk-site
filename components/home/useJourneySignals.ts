"use client";
export function sendJourney(e:any){
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    const blob = new Blob([JSON.stringify(e)], { type: 'application/json' });
    (navigator as any).sendBeacon('/api/telemetry/journey', blob);
  } else if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback?.(()=>fetch('/api/telemetry/journey', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e) }));
  } else {
    setTimeout(()=>{ fetch('/api/telemetry/journey', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(e) }).catch(()=>{}); }, 0);
  }
}


