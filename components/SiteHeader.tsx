'use client'

import { themeForRoute } from '@/lib/brand/theme'
import { withBase } from '@/lib/routing/basePath'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type CSSProperties } from 'react'
import ThemeSwitch from './ThemeSwitch'

type Item = { href: string; label: string }

const TOP_ORDER: Item[] = [
  { href: '/owners', label: 'Owners' },
  { href: '/institutions', label: 'Institutions' },
  { href: '/transparency', label: 'Transparency' },
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/whitepaper', label: 'Whitepaper' },
  { href: '/faq', label: 'FAQ' },
  { href: '/mxtk-cares', label: 'MXTK Cares' },
  { href: '/resources', label: 'Resources' },
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
    const currentPath = pathname.replace(/^\/mxtk/, '') || '/'
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
            <Link href={mounted ? withBase('/') : '/'} className="flex items-center" aria-label="MXTK Home">
              {mounted ? (
                <Image 
                  src={withBase("/logo-horizontal.svg")}
                  alt="MXTK" 
                  width={140} 
                  height={32} 
                  priority 
                  style={{ width: '140px', height: '32px' }}
                />
              ) : (
                <div 
                  style={{ 
                    width: '140px', 
                    height: '32px',
                    backgroundColor: 'transparent'
                  }}
                  aria-label="MXTK Logo Loading"
                />
              )}
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {TOP_ORDER.map(({ href, label }) => {
              const t = themeForRoute(href)
              const isActive = getActiveState(href)

              return (
                                       <Link
                         key={href}
                         href={mounted ? withBase(href) : href}
                         aria-current={isActive ? 'page' : undefined}
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
            {TOP_ORDER.map(({ href, label }) => {
              const isActive = getActiveState(href)
              return (
                                       <Link
                         key={href}
                         href={mounted ? withBase(href) : href}
                         className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)]"
                         style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as CSSProperties}
                         onClick={() => setOpen(false)}
                         aria-current={isActive ? 'page' : undefined}
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