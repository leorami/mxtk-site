'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const isDark = saved === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    setDark(isDark)
  }, [])

  if (dark === null) return null

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <button 
      onClick={toggle} 
      className='rounded-xl border px-3 py-1 text-sm transition-colors bg-[var(--surface-2)] border-[var(--border-soft)] hover:bg-[color-mix(in_srgb,var(--mxtk-orange)_10%,transparent)]'
    >
      {dark ? 'Light' : 'Dark'} mode
    </button>
  )
}