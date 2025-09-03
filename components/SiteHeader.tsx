'use client'
import ThemeToggle from '@/components/ThemeToggle'
import ExperienceToggle from '@/components/experience/ExperienceToggle'

import { themeForRoute } from '@/lib/brand/theme'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties, useEffect, useState } from 'react'

type Item = { href: string; label: string }

const TOP_ORDER: Item[] = [
  { href: 'owners', label: 'Owners' },
  { href: 'institutions', label: 'Institutions' },
  { href: 'transparency', label: 'Transparency' },
  { href: 'ecosystem', label: 'Ecosystem' },
  { href: 'whitepaper', label: 'Whitepaper' },
  { href: 'faq', label: 'FAQ' },
  { href: 'mxtk-cares', label: 'MXTK Cares' },
  { href: 'resources', label: 'Resources' },
]

export default function SiteHeader() {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Use SVG logo for better scaling and base path support

  const isHome = (() => {
    // With Next.js basePath, pathname is already stripped of basePath
    // So the home page is always '/' regardless of basePath
    const p = (pathname || '/').replace(/\/+$/, '') || '/'
    return p === '/' || p === ''
  })()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getActiveState = (href: string) => {
    const currentPath = pathname || '/'
    const leaf = href.replace(/^\/+|\/+$/g, '') // remove leading/trailing slashes
    if (leaf === '') return currentPath === '/'
    // basePath-aware: consider it active if pathname ends with '/leaf' or '/leaf/...'
    return currentPath.endsWith(`/${leaf}`) || currentPath.includes(`/${leaf}/`)
  }

  return (
    <header className="sticky top-0 z-50" suppressHydrationWarning>
      <div className="brand-header">
        <div className="mx-auto flex max-w-none items-center justify-between px-4" style={{ height: '76px' }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center" aria-label="MXTK Home" suppressHydrationWarning>
              <div style={{ position: 'relative', width: 120, height: 32 }}>
                <Image
                  src="/logo-horizontal.png"
                  alt="MXTK logo"
                  fill
                  sizes="120px"
                  priority
                />
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {TOP_ORDER.map(({ href, label }) => {
              const t = themeForRoute(href)
              const isActive = getActiveState(href)
              // Let Next.js basePath handle prefixing automatically
              const navHref = `/${href}`

              return (
                <Link
                  key={href}
                  href={navHref}
                  aria-current={isActive ? 'page' : undefined}
                  className="nav-link nav-pill px-3 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/35"
                  style={{ ['--hover-bg' as any]: t.hoverBg } as CSSProperties}
                  suppressHydrationWarning
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ExperienceToggle />
            <ThemeToggle />
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-[var(--border-soft)] px-4 py-3 text-xl"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>
      <div className="brand-accent-line"></div>

      {open && (
        <div className="lg:hidden border-t border-[var(--border-soft)] bg-[var(--surface-2)]">
          <div className="mx-auto max-w-none px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100dvh-90px)]">
            <div className="grid grid-cols-2 gap-1">
            {TOP_ORDER.map(({ href, label }) => {
              const isActive = getActiveState(href)
              // Let Next.js basePath handle prefixing automatically for mobile
              const navHref = `/${href}`
              return (
                <Link
                  key={href}
                  href={navHref}
                  className="block px-3 py-1 rounded-lg hover:bg-[var(--hover-bg)]"
                  style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as CSSProperties}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  suppressHydrationWarning
                >
                  {label}
                </Link>
              )
            })}
            </div>
            
            {/* Legal Links Section */}
            <div className="pt-4 border-t border-[var(--border-soft)]/30">
              <div className="text-xs font-semibold text-muted mb-2 px-3">Legal</div>
              <div className="space-y-1">
                <Link
                  href="/legal/terms"
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-[var(--hover-bg)] opacity-75"
                  onClick={() => setOpen(false)}
                >
                  Terms
                </Link>
                <Link
                  href="/legal/privacy"
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-[var(--hover-bg)] opacity-75"
                  onClick={() => setOpen(false)}
                >
                  Privacy
                </Link>
                <Link
                  href="/legal/disclosures"
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-[var(--hover-bg)] opacity-75"
                  onClick={() => setOpen(false)}
                >
                  Disclosures
                </Link>
              </div>
            </div>
            
            <div className="pt-3 space-y-2">
              <div className="flex items-center gap-2">
                <ExperienceToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}