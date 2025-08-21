'use client'

import { useEffect, useState } from 'react'

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.5 6.5-1.4-1.4M7.9 7.9 6.5 6.5m11 0-1.4 1.4M7.9 16.1 6.5 17.5" />
    </svg>
  )
}
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3 7.5 7.5 0 1 0 21 12.8z" />
    </svg>
  )
}

export default function ThemeSwitch() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')) }, [])

  function toggle() {
    const root = document.documentElement
    const next = !dark
    root.classList.toggle('dark', next)
    setDark(next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch { }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] px-3 py-1.5 text-[13px] hover:bg-[rgba(224,147,43,.12)] transition-colors"
      style={{ color: 'var(--ink-strong)' }}
    >
      <div className={`relative h-5 w-10 rounded-full ${dark ? 'bg-black/25' : 'bg-black/15'}`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-[var(--shadow-lift-sm)] transition-all duration-200 ${dark ? 'right-0.5' : 'left-0.5'}`} />
      </div>
      {dark ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}