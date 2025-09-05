"use client";
import { GuidePanel } from '@/components/ai/GuidePanel';
// Mode controls removed from drawer header per UI cleanup
import { useEffect, useState } from 'react';

export default function GuideDrawer(){
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<string>("");

  useEffect(()=>{
    const h = (e: Event)=>{ 
      const d=(e as CustomEvent).detail||{}; 
      if(d.prompt) setPrefill(String(d.prompt)); 
      setOpen(true);
      // If send flag is set, auto-send the message
      if(d.send && d.prompt) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('guide:auto-send', { detail: { message: d.prompt } }));
        }, 100);
      }
    };
    window.addEventListener('mxtk:guide:open', h as EventListener);
    window.addEventListener('mxtk.openGuide', h as EventListener);
    return ()=>{ window.removeEventListener('mxtk:guide:open', h as EventListener); window.removeEventListener('mxtk.openGuide', h as EventListener); };
  },[]);

  useEffect(()=>{
    const root = document.documentElement;
    if(open){ root.setAttribute('data-guide-open','true'); } else { root.removeAttribute('data-guide-open'); }
    return ()=>{ document.documentElement.removeAttribute('data-guide-open'); };
  },[open]);

  // Drawer host; footer chat lives in footer, not floating
  return (
    <>
      {/* Full drawer when open */}
      {open && (
        <aside role="complementary" aria-label="Sherpa Drawer" className="guide-drawer fixed right-0 z-[120] glass glass--panel backdrop-blur-xl shadow-2xl flex flex-col animate-guide-enter">
          <button
            aria-label="Close Sherpa"
            onClick={()=>setOpen(false)}
            className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full grid place-items-center bg-white/85 dark:bg-gray-900/70 text-gray-900 dark:text-white border border-black/10 dark:border-white/20 shadow hover:bg-white/95 dark:hover:bg-gray-900/85"
          >
            ×
          </button>
          <div className="min-h-0 flex-1 drawer-body">
            <GuidePanel embedded prefillPrompt={prefill} onClose={()=>setOpen(false)} />
          </div>
          {/* Drawer intentionally has no internal chat input. Footer owns chat. */}
        </aside>
      )}
    </>
  );
}


