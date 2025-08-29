'use client'
import { useBasePath } from '@/components/providers/BasePathProvider'
import { themeForRoute } from '@/lib/brand/theme'
import { usePublicPath } from '@/lib/routing/getPublicPathClient'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties, useEffect, useState } from 'react'
import ThemeSwitch from './ThemeSwitch'

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
  const logoUrl = usePublicPath('logo-horizontal.png')
  const basePath = useBasePath() || ''

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
    <header className="sticky top-0 z-50">
      <div className="brand-header">
        <div className="mx-auto flex max-w-none items-center justify-between px-4" style={{ height: '76px' }}>
          <div className="flex items-center gap-3">
            <Link href={(basePath ? `${basePath}/` : '/').replace(/\/{2,}/g, '/')} className="flex items-center" aria-label="MXTK Home" suppressHydrationWarning>
              <img 
                src={logoUrl}
                alt="MXTK logo"
                width={120} 
                height={32} 
                style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {TOP_ORDER.map(({ href, label }) => {
              const t = themeForRoute(href)
              const isActive = getActiveState(href)
              const navHref = `${basePath}/${href}`.replace(/\/{2,}/g, '/')

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

          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitch />
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-[var(--border-soft)] px-3 py-2"
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
          <div className="mx-auto max-w-none px-4 py-3 space-y-1">
            {TOP_ORDER.map(({ href, label }) => {
              const isActive = getActiveState(href)
              const navHref = `${basePath}/${href}`.replace(/\/{2,}/g, '/')
              return (
                <Link
                  key={href}
                  href={navHref}
                  className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)]"
                  style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as CSSProperties}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  suppressHydrationWarning
                >
                  {label}
                </Link>
              )
            })}
            <div className="pt-3"><ThemeSwitch /></div>
          </div>
        </div>
      )}
    </header>
  )
}