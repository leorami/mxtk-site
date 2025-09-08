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
      try { const d = (e as CustomEvent).detail || {}; if (d.prompt) setPrefill(String(d.prompt)); } catch { }
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
    <div data-embedded-guide className="fixed inset-0 z-[9999] pointer-events-none">
      {open && (
        <div
          className="pointer-events-auto flex items-end sm:items-center justify-center w-full h-full px-1 sm:px-3"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
        >
          <div
            className="w-full sm:w-[min(720px,100%)]"
            style={{
              maxWidth: '920px',
              // On mobile, make the panel wider and taller to cover more page content
              // while staying above iOS browser controls  
              maxHeight: '85vh'
            }}
          >
            <GuidePanel embedded prefillPrompt={prefill} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
