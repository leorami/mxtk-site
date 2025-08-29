'use client';
import { usePublicPath } from '@/lib/routing/getPublicPathClient';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Parallax } from 'react-scroll-parallax';

export type Variant = 'home'|'owners'|'transparency'|'institutions'|'whitepaper'|'roadmap'|'faq'|'resources'|'media'|'team'|'contact'|'cares';

const VARIANT_TO_CLASS: Record<Variant, string> = {
  home: 'bg-amber', owners: 'bg-citrine', transparency: 'bg-tigereye', institutions: 'bg-lapis',
  whitepaper: 'bg-obsidian', roadmap: 'bg-hematite', faq: 'bg-quartz', resources: 'bg-hematite',
  media: 'bg-hematite', team: 'bg-hematite', contact: 'bg-hematite', cares: 'bg-amber',
};

function usePrefersReducedMotion(){
  const [reduced,setReduced]=useState(true);
  useEffect(()=>{ const m=window.matchMedia('(prefers-reduced-motion: reduce)');
    const on=()=>setReduced(m.matches); on(); m.addEventListener?.('change',on);
    return()=>m.removeEventListener?.('change',on);
  },[]); return reduced;
}

type Props = { variant?: Variant; wash?: boolean; className?: string; children?: React.ReactNode; texture?: string; masked?: boolean; };

export default function MineralBackground({ variant='home', wash=false, className='', children, texture, masked=false }: Props){
  const base = VARIANT_TO_CLASS[variant] ?? VARIANT_TO_CLASS.home;
  const reduced = usePrefersReducedMotion();
  const url = texture ? usePublicPath(texture) : '';
  return (
    <div className={cn('relative', base, masked && 'mask-organic', className)}>
      {texture ? (
        <Parallax speed={-10} disabled={reduced}>
          <div aria-hidden className="z-mineral absolute inset-0 bg-cover bg-center opacity-[0.28] mix-blend-multiply" style={{ backgroundImage: `url(${url})` }} />
        </Parallax>
      ) : null}
      {wash ? <div className="z-mineral mineral-wash" aria-hidden /> : null}
      <div className="relative z-content">{children}</div>
    </div>
  );
}
