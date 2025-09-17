"use client";
import GuideDrawer from '@/components/ai/GuideDrawer';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function GuideHost() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [corner, setCorner] = useState<'right' | 'left'>('right');
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    try { setDismissed(localStorage.getItem('mxtk_guide_cta_dismissed') === '1'); } catch { }
    // Ensure no stale attribute from previous route persists
    try {
      const saved = localStorage.getItem('mxtk_guide_open');
      const shouldOpen = saved === '1';
      const root = document.documentElement;
      if (shouldOpen) root.classList.add('guide-open');
      else root.classList.remove('guide-open');
    } catch { }
  }, []);

  // On route change, always ensure drawer-closed state
  useEffect(() => {
    try {
      // Respect persisted preference instead of force-closing on navigation
      const saved = localStorage.getItem('mxtk_guide_open');
      const shouldOpen = saved === '1';
      const root = document.documentElement;
      if (shouldOpen) root.classList.add('guide-open');
      else root.classList.remove('guide-open');
    } catch { }
  }, [pathname]);

  // page-aware nudge (very simple seed)
  const prompt = useMemo(() => {
    const t = (typeof document !== 'undefined' ? document.title : '') || 'MXTK';
    if (/owners|wallet/i.test(t)) return 'New here? Ask how MXTK works for owners';
    if (/institutions|markets?/i.test(t)) return 'See MXTK for institutions and market data';
    return 'Hi! Ask me anything about MXTK—start with “What is MXTK?”';
  }, []);

  const openGuide = () => {
    window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt } }));
  };

  if (!mounted) return null;
  return (
    <div className="site-container mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 relative space-y-0">
      <GuideDrawer insideContainer />
    </div>
  );
}


