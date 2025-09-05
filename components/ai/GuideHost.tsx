"use client";
import GuideDrawer from '@/components/ai/GuideDrawer';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export default function GuideHost(){
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [corner, setCorner] = useState<'right'|'left'>('right');

  useEffect(()=>{ setMounted(true); try{ setDismissed(localStorage.getItem('mxtk_guide_cta_dismissed')==='1'); }catch{} },[]);

  // page-aware nudge (very simple seed)
  const prompt = useMemo(()=>{
    const t = (typeof document!=='undefined' ? document.title : '') || 'MXTK';
    if(/owners|wallet/i.test(t)) return 'New here? Ask how MXTK works for owners';
    if(/institutions|markets?/i.test(t)) return 'See MXTK for institutions and market data';
    return 'Hi! Ask me anything about MXTK—start with “What is MXTK?”';
  },[]);

  const openGuide = () => {
    window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail:{ prompt } }));
  };

  const bubble = null;

  if(!mounted) return null;
  return (
    <>
      {createPortal(bubble, document.body)}
      <GuideDrawer />
    </>
  );
}


