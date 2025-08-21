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
      className='rounded-xl border border-brand-border bg-white/60 dark:bg-dark-surface/60 dark:border-dark-border px-3 py-1 text-sm hover:bg-white/80 dark:hover:bg-dark-surface/80 transition-colors'
    >
      {dark ? 'Light' : 'Dark'} mode
    </button>
  )
}