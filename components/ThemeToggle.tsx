'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const systemDark = mq.matches
    const stored = (localStorage.getItem('theme') as 'light' | 'dark' | null)
    const initial = stored ?? (systemDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  useEffect(() => {
    if (!theme) return
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    
    // Add sparkle effect on theme change
    const sparkleEl = document.querySelector('.sparkle-once');
    if (sparkleEl) {
      sparkleEl.classList.remove('sparkle-once');
      setTimeout(() => sparkleEl.classList.add('sparkle-once'), 10);
    }
  }, [theme])

  if (theme === null) return null

  return (
    <div
      className={[
        'flex items-center gap-1 rounded-full px-1 py-1 glass',
        'bg-[var(--accent,#ffb84d)]/10',
        'border border-[var(--accent,#ffb84d)]/25',
        'shadow-sm'
      ].join(' ')}
      role="group"
      aria-label="Theme"
    >
      <button
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        className={[
          'px-3 py-1 rounded-full text-sm transition',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--mxtk-orange)_60%,transparent)]',
          theme === 'light' ? 'bg-[color-mix(in_srgb,var(--mxtk-orange)_30%,transparent)] dark:bg-[color-mix(in_srgb,var(--mxtk-orange)_34%,transparent)] shadow-sm' : 'opacity-85 hover:opacity-100'
        ].join(' ')}
      >
        Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        className={[
          'px-3 py-1 rounded-full text-sm transition',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--mxtk-orange)_60%,transparent)]',
          theme === 'dark' ? 'bg-[color-mix(in_srgb,var(--mxtk-orange)_30%,transparent)] dark:bg-[color-mix(in_srgb,var(--mxtk-orange)_34%,transparent)] shadow-sm' : 'opacity-85 hover:opacity-100'
        ].join(' ')}
      >
        Dark
      </button>
    </div>
  )
}