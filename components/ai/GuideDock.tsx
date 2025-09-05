'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GuidePanel } from './GuidePanel';

export default function GuideDock() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState('');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const openHandler = (e: Event) => {
      try { const d = (e as CustomEvent).detail || {}; if (d.prompt) setPrefill(String(d.prompt)); } catch {}
      setOpen(true);
    };
    window.addEventListener('mxtk:guide:open', openHandler as EventListener);
    window.addEventListener('mxtk.openGuide', openHandler as EventListener);
    return () => {
      window.removeEventListener('mxtk:guide:open', openHandler as EventListener);
      window.removeEventListener('mxtk.openGuide', openHandler as EventListener);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-embedded-guide className="fixed inset-0 z-[120] pointer-events-none">
      {open && (
        <div className="pointer-events-auto">
          <GuidePanel embedded prefillPrompt={prefill} onClose={() => setOpen(false)} />
        </div>
      )}
    </div>,
    document.body
  );
}
