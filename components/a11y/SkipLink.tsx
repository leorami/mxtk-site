"use client";
import type React from 'react';
export default function SkipLink(){
  function onClick(e: React.MouseEvent<HTMLAnchorElement>){
    try {
      const id = (e.currentTarget.getAttribute('href') || '').replace('#','') || 'main-content'
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        try { (el as HTMLElement).setAttribute('tabindex', '-1') } catch {}
        ;(el as HTMLElement).focus()
      }
    } catch {}
  }
  return (
    <a href="#main-content" onClick={onClick} className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-amber-600 text-white px-3 py-2 rounded">
      Skip to content
    </a>
  );
}


