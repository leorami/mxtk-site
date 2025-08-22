'use client'

import { themeForRoute } from '@/lib/brand/theme'
import { withBase } from '@/lib/routing/basePath'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import ThemeSwitch from './ThemeSwitch'

type Item = { href: string; label: string }

const TOP_ORDER: Item[] = [
  { href: '/owners', label: 'Owners' },
  { href: '/institutions', label: 'Institutions' },
  { href: '/transparency', label: 'Transparency' },
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/whitepaper', label: 'Whitepaper' },
  { href: '/faq', label: 'FAQ' },
  { href: '/elite-drop', label: 'MXTK Gives' },
  { href: '/resources', label: 'Resources' },
]



export default function SiteHeader() {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div className="brand-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4" style={{ height: '76px' }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center" aria-label="MXTK Home">
              <Image className="logo" src="/logo-horizontal.svg" alt="MXTK" width={140} height={32} priority />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {TOP_ORDER.map(({ href, label }) => {
              const t = themeForRoute(href)
              const is = pathname === href || pathname.startsWith(href + '/')

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={is ? 'page' : undefined}
                  className="nav-link nav-pill px-3 py-2 rounded-lg transition-colors"
                  style={{ ['--hover-bg' as any]: t.hoverBg } as CSSProperties}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitch />
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-[var(--border-soft)] px-3 py-2"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
      <div className="brand-accent-line" />

      {open && (
        <div className="lg:hidden border-t border-[var(--border-soft)] bg-[var(--surface-2)]">
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-1">
            {TOP_ORDER.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)]"
                style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as CSSProperties}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-[var(--border-soft)] text-xs uppercase tracking-wide text-muted">Resources</div>
            {RESOURCES_DROPDOWN.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)]"
                style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as CSSProperties}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3"><ThemeSwitch /></div>
          </div>
        </div>
      )}
    </header>
  )
}