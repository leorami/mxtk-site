'use client'

import { themeForRoute } from '@/lib/brand/theme'
import { getPublicPath, getRelativePath } from '@/lib/routing/basePath'
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const getActiveState = (href: string) => {
    // Normalize paths for comparison
    const currentPath = pathname || '/'
    const linkPath = href === '/' ? '/' : href
    
    // Check exact match or if current path starts with link path
    return currentPath === linkPath || 
           (linkPath !== '/' && currentPath.startsWith(linkPath))
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="brand-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4" style={{ height: '76px' }}>
          <div className="flex items-center gap-3">
            <Link href={getRelativePath('', pathname)} className="flex items-center" aria-label="MXTK Home" suppressHydrationWarning>
              {mounted ? (
                <img 
                  src={getPublicPath('logo-horizontal.svg', pathname)}
                  alt="MXTK" 
                  width={140} 
                  height={32} 
                  style={{ width: '140px', height: '32px' }}
                />
              ) : (
                <span style={{width:140,height:32,display:'inline-block'}} />
              )}
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {TOP_ORDER.map(({ href, label }) => {
              const t = themeForRoute(href)
              const isActive = getActiveState(href)
              const navHref = getRelativePath(href, pathname)

              return (
                <Link
                  key={href}
                  href={navHref}
                  aria-current={isActive ? 'page' : undefined}
                  className="nav-link nav-pill px-3 py-2 rounded-lg transition-colors"
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
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-1">
            {TOP_ORDER.map(({ href, label }) => {
              const isActive = getActiveState(href)
              const navHref = getRelativePath(href, pathname)
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