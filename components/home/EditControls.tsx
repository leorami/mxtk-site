"use client";
import React from "react";

function getInitialLock(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') return window.matchMedia('(max-width: 767px)').matches;
  return (window as any).innerWidth <= 767;
}

function useMobileEditLock(): boolean {
  const [locked, setLocked] = React.useState<boolean>(() => getInitialLock());
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia) {
      const q = window.matchMedia("(max-width: 767px)");
      const upd = () => setLocked(q.matches);
      upd(); q.addEventListener?.("change", upd);
      return () => q.removeEventListener?.("change", upd);
    } else {
      // JSDOM fallback
      setLocked((window as any).innerWidth <= 767);
    }
  }, []);
  return locked;
}

export default function EditControls(){
  const locked = useMobileEditLock();
  const [notice, setNotice] = React.useState(false);
  if (locked) {
    return (
      <div>
        <button aria-label="Editing unavailable on mobile" onClick={()=>setNotice(true)} className="text-xs opacity-70 underline">
          Editing unavailable on mobile
        </button>
        {notice && (
          <div className="text-xs mt-1" role="status">Edit layout on tablet/desktop.</div>
        )}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 text-xs opacity-70">
      <button className="chip">Move</button>
      <button className="chip">Resize</button>
    </div>
  );
}


