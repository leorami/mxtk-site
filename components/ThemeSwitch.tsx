'use client'

import { useEffect, useState } from 'react'

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...props}>
      {/* Main sun body with gradient-like effect */}
      <circle cx="12" cy="12" r="4" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="3" fill="#FFED4A" />
      <circle cx="12" cy="12" r="2" fill="#FFF59D" />
      
      {/* Sun rays - longer and more prominent */}
      <g fill="#E8A53A" stroke="#E8A53A" strokeWidth="0.5">
        {/* Cardinal directions - longer rays */}
        <rect x="11.5" y="1" width="1" height="4" rx="0.5" />
        <rect x="11.5" y="19" width="1" height="4" rx="0.5" />
        <rect x="1" y="11.5" width="4" height="1" rx="0.5" />
        <rect x="19" y="11.5" width="4" height="1" rx="0.5" />
        
        {/* Diagonal rays */}
        <rect x="4.5" y="4.5" width="1" height="3" rx="0.5" transform="rotate(45 5 6)" />
        <rect x="18.5" y="4.5" width="1" height="3" rx="0.5" transform="rotate(135 19 6)" />
        <rect x="4.5" y="16.5" width="1" height="3" rx="0.5" transform="rotate(-45 5 18)" />
        <rect x="18.5" y="16.5" width="1" height="3" rx="0.5" transform="rotate(-135 19 18)" />
      </g>
    </svg>
  )
}
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7.5 7.5 0 0 0 21 12.8z" />
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
      className="nav-link nav-pill inline-flex items-center justify-center w-9 h-9"
      style={{ ['--hover-bg' as any]: 'var(--mxtk-hover-bg)', color: dark ? '#FFFFFF' : '#E8A53A' }}
      title={dark ? 'Switch to light' : 'Switch to dark'}
    >
      {dark ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}