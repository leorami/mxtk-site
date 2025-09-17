"use client";
import Button from '@/components/ui/Button';
import { useEffect, useRef, useState } from 'react';

export default function HeaderSherpa() {
  const [shimmer, setShimmer] = useState(false)
  const [active, setActive] = useState(false)
  const timerRef = useRef<number | undefined>()

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Reflect current drawer state
    try { setActive(document.documentElement.classList.contains('guide-open')) } catch { }
    const mo = new MutationObserver(() => {
      try { setActive(document.documentElement.classList.contains('guide-open')) } catch { }
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) return
    const play = () => { setShimmer(true); window.setTimeout(() => setShimmer(false), 2400) }
    play()
    let interactions = 0
    try { interactions = Number(localStorage.getItem('mxtk_sherpa_interactions') || '0') } catch { }
    const interval = Math.min(180_000, 60_000 + interactions * 15_000)
    timerRef.current = window.setInterval(play, interval) as unknown as number
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); mo.disconnect() }
  }, [])

  function toggle() {
    try {
      const isOpen = document.documentElement.classList.contains('guide-open')
      if (isOpen) {
        window.dispatchEvent(new CustomEvent('mxtk:guide:close', { detail: {} }))
      } else {
        // If mobile/tablet menu is open, close it before opening Sherpa
        try {
          const navToggle = document.querySelector('[data-testid="nav-toggle"]') as HTMLButtonElement | null
          const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement | null
          if (mobileMenu && navToggle && getComputedStyle(mobileMenu).display !== 'none') {
            navToggle.click()
          }
        } catch {}
        window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: {} }))
      }
    } catch { }
  }

  return (
    <div data-testid="xp-toggle-group" className="xp-toggle-group experience-toggle">
      <Button
        variant="primary"
        onClick={toggle}
        className={`transition-all duration-200 sherpa-theme-button i-mxtk-sparkles ${active ? 'active' : 'inactive'} ${shimmer ? 'sherpa-shimmer' : ''} text-[color:var(--header-pill-ink,inherit)]`}
        aria-label="Open Sherpa"
        data-testid="sherpa-pill"
     >
        <strong>Sherpa</strong>
        <style jsx global>{`
          :root { --header-pill-ink: #0B0E12 }
          .dark :root, .dark { --header-pill-ink: #FFFFFF }
          /* Gem-like shimmer: subtle diagonal sweep with specular glint */
          .sherpa-shimmer::after{
            content:""; position:absolute; inset:0; border-radius:9999px; pointer-events:none;
            background: linear-gradient(130deg, transparent 0%, rgba(255,255,255,0.35) 12%, transparent 24%) ,
                        radial-gradient(60% 120% at 30% 0%, rgba(255,255,255,0.25), transparent 60%);
            background-repeat: no-repeat;
            background-size: 200% 100%, 100% 100%;
            animation: gem-sweep 2.8s ease-in-out infinite;
            mix-blend-mode: overlay;
          }
          @keyframes gem-sweep {
            0% { background-position: -150% 0, 0 0; opacity: .6 }
            45% { background-position: 120% 0, 0 0; opacity: 1 }
            100% { background-position: 120% 0, 0 0; opacity: .6 }
          }
        `}</style>
      </Button>
    </div>
  )
}


