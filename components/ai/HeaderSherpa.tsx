"use client";
import { useEffect, useRef, useState } from 'react';

export default function HeaderSherpa(){
  const [shimmer, setShimmer] = useState(false)
  const [active, setActive] = useState(false)
  const timerRef = useRef<number | undefined>()

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Reflect current drawer state
    try { setActive(document.documentElement.classList.contains('guide-open')) } catch {}
    const mo = new MutationObserver(() => {
      try { setActive(document.documentElement.classList.contains('guide-open')) } catch {}
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) return
    const play = () => { setShimmer(true); window.setTimeout(() => setShimmer(false), 2400) }
    play()
    let interactions = 0
    try { interactions = Number(localStorage.getItem('mxtk_sherpa_interactions') || '0') } catch {}
    const interval = Math.min(180_000, 60_000 + interactions * 15_000)
    timerRef.current = window.setInterval(play, interval) as unknown as number
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); mo.disconnect() }
  }, [])

  function toggle(){
    try {
      const isOpen = document.documentElement.classList.contains('guide-open')
      if (isOpen) {
        window.dispatchEvent(new CustomEvent('mxtk:guide:close', { detail: {} }))
      } else {
        window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: {} }))
      }
    } catch {}
  }

  return (
    <button
      type="button"
      aria-label="Open Sherpa"
      data-testid="sherpa-pill"
      onClick={toggle}
      className={`relative inline-flex items-center gap-2 h-9 px-4 rounded-full shadow hover:shadow-md transition-colors duration-200 ${active ? 'bg-[var(--mxtk-orange)] text-white' : 'bg-ink-100 text-ink-900'} ${shimmer ? 'sherpa-shimmer' : ''}`}
    >
      <span className="i-mxtk-sparkles" aria-hidden></span>
      <strong>Sherpa</strong>
      <style jsx global>{`
        .sherpa-shimmer::after{
          content:""; position:absolute; inset:0; border-radius:9999px;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,.6) 30deg, transparent 60deg);
          animation: gem 2.4s linear forwards; pointer-events:none; mix-blend: overlay;
        }
        @keyframes gem{ 0%{ transform: rotate(0turn)} 100%{ transform: rotate(1turn)} }
      `}</style>
    </button>
  )
}


