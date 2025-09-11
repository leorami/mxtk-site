"use client";
import { GuidePanel } from '@/components/ai/GuidePanel';
import { useEffect, useState } from 'react';

export default function GuideDrawer() {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<string>("");

  useEffect(() => {
    try {
      // Initialize from persisted state
      const saved = localStorage.getItem('mxtk_guide_open');
      const initial = saved === '1';
      setOpen(initial);
      const root = document.documentElement;
      if (initial) root.classList.add('guide-open');
      else root.classList.remove('guide-open');
    } catch { }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add('guide-open');
    else root.classList.remove('guide-open');
    // Persist user preference
    try { localStorage.setItem('mxtk_guide_open', open ? '1' : '0'); } catch { }
    return () => { try { root.classList.remove('guide-open'); } catch { } };
  }, [open]);

  // Wave 12.2: Support 'mxtk:guide:prefill' to open drawer and seed input
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail || {};
        if (d.prompt) setPrefill(String(d.prompt));
        setOpen(true);
      } catch { }
    };
    window.addEventListener('mxtk:guide:prefill', handler as EventListener);
    return () => window.removeEventListener('mxtk:guide:prefill', handler as EventListener);
  }, []);

  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      if (d.prompt) setPrefill(String(d.prompt));
      setOpen(true);
      if (d.send && d.prompt) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('guide:auto-send', { detail: { message: d.prompt } }));
        }, 100);
      }
    };
    const close = () => setOpen(false);
    window.addEventListener('mxtk:guide:open', h as EventListener);
    window.addEventListener('mxtk:guide:close', close as EventListener);
    window.addEventListener('mxtk.openGuide', h as EventListener);
    return () => {
      window.removeEventListener('mxtk:guide:open', h as EventListener);
      window.removeEventListener('mxtk:guide:close', close as EventListener);
      window.removeEventListener('mxtk.openGuide', h as EventListener);
    };
  }, []);

  return (
    <aside
      data-guide-panel className="guide-panel glass"
      data-open={open ? 'true' : 'false'}
      role="complementary"
      aria-label="Sherpa Drawer" tabIndex={open ? 0 : -1}
      aria-hidden={!open}

      className="guide-drawer fixed right-0 z-[120] glass glass--panel backdrop-blur-xl shadow-2xl flex flex-col"
      style={{ top: 'var(--nav-height)', bottom: 'var(--footer-height)', height: 'auto', overflow: 'hidden' }}
    >
      <div className="min-h-0 flex-1 drawer-body">
        <GuidePanel embedded prefillPrompt={prefill} onClose={() => setOpen(false)} />
      </div>
    </aside>
  );
}
