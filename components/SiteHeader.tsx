'use client'
import HeaderSherpa from '@/components/ai/HeaderSherpa'

// import GuideHeaderButton from '@/components/ai/GuideHeaderButton'
import ExperienceToggle from '@/components/experience/ExperienceToggle'

import { useBasePath } from '@/lib/basepath'
import { themeForRoute } from '@/lib/brand/theme'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties, useEffect, useState } from 'react'

type Item = { href: string; label: string }

// Navigation groups for dropdown menus
const NAVIGATION_GROUPS = {
  "Who's it for": [
    { href: 'owners', label: 'Owners' },
    { href: 'institutions', label: 'Institutions' },
  ],
  "Transparency": [
    { href: 'ecosystem', label: 'Ecosystem' },
    { href: 'transparency', label: 'Trust & Verification' },
    { href: 'whitepaper', label: 'Whitepaper' },
    { href: 'resources', label: 'Resources' },
    { href: 'faq', label: 'FAQ' },
  ],
  "Programs": [
    { href: 'mxtk-cares', label: 'MXTK Cares' },
  ]
}

export default function SiteHeader({ hasHome }: { hasHome?: boolean }) {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const basePath = useBasePath()
  // Use SVG logo for better scaling and base path support

  const isHome = (() => {
    // With Next.js basePath, pathname is already stripped of basePath
    // So the home page is always '/' regardless of basePath
    const p = (pathname || '/').replace(/\/+$/, '') || '/'
    return p === '/' || p === ''
  })()

  useEffect(() => {
    setMounted(true)
    // Ensure closed padding on first paint (SSR mismatch guard)
    try { document.documentElement.classList.remove('guide-open') } catch {}
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  const getActiveState = (href: string) => {
    const currentPath = pathname || '/'
    const leaf = href.replace(/^\/+|\/+$/g, '') // remove leading/trailing slashes
    if (leaf === '') return currentPath === '/'
    // basePath-aware: consider it active if pathname ends with '/leaf' or '/leaf/...'
    return currentPath.endsWith(`/${leaf}`) || currentPath.includes(`/${leaf}/`)
  }

  const isGroupActive = (groupItems: Item[]) => {
    return groupItems.some(item => getActiveState(item.href))
  }

  const handleDropdownMouseEnter = (groupName: string) => {
    // Clear any pending timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setActiveDropdown(groupName)
  }

  const handleDropdownMouseLeave = () => {
    // Add a small delay before closing to allow moving to dropdown items
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
    setHoverTimeout(timeout)
  }

  return (
    <header className="sticky top-0 z-50" suppressHydrationWarning>
      <div className="brand-header header-container">
        <div className="mx-auto flex max-w-none items-center justify-between px-4" style={{ height: '76px' }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center justify-center" aria-label="MXTK Home" suppressHydrationWarning>
              <div className="flex items-center justify-center" style={{ position: 'relative', width: 120, height: 36 }}>
                <Image
                  src={`${basePath}/logo-horizontal.png`}
                  alt="MXTK logo"
                  fill
                  sizes="120px"
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            {/* Add a Home link next to the logo (left cluster). BasePathLink/Link keeps basePath honored. */}
            <nav data-testid="nav-links" className="hidden nav:flex items-center justify-center gap-1 relative">
              {hasHome && (
                <Link
                  href="/home"
                  className="nav-link nav-pill px-3 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/35"
                  suppressHydrationWarning
                >
                  Home
                </Link>
              )}
              {Object.entries(NAVIGATION_GROUPS).map(([groupName, groupItems]) => {
                const isActive = isGroupActive(groupItems)
                const isDropdownOpen = activeDropdown === groupName
                return (
                  <div 
                    key={groupName}
                    className="relative"
                    onMouseEnter={() => handleDropdownMouseEnter(groupName)}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <button
                      className={`nav-link nav-pill px-3 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/35 flex items-center gap-1 ${isActive ? 'font-semibold' : ''}`}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      {groupName}
                      <svg 
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 bg-[var(--surface-card)] border border-[var(--border-soft)] rounded-lg shadow-lg py-1 min-w-[180px] z-50">
                        {groupItems.map(({ href, label }) => {
                          const t = themeForRoute(href)
                          const isItemActive = getActiveState(href)
                          const navHref = `/${href}`
                          return (
                            <Link
                              key={href}
                              href={navHref}
                              aria-current={isItemActive ? 'page' : undefined}
                              className={`block px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition-colors ${isItemActive ? 'font-semibold bg-[var(--hover-bg)]' : ''}`}
                              style={{ ['--hover-bg' as any]: t.hoverBg } as CSSProperties}
                              suppressHydrationWarning
                            >
                              {label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>

          <div data-testid="experience-controls-desktop" className="hidden nav:flex items-center justify-center gap-2">
            <div className="flex items-center gap-2" data-testid="sherpa-cluster">
              <div data-testid="experience-icons" className="mr-1"><ExperienceToggle /></div>
              <HeaderSherpa />
            </div>
            {/* ThemeSwitch moved to footer */}
          </div>

          <div className="nav:hidden flex items-center gap-2">
            <button
              data-testid="nav-toggle"
              className="inline-flex items-center justify-center rounded-md border border-[var(--border-soft)] px-4 py-2 text-xl min-h-[36px]"
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
            {/* Mobile: keep Sherpa pinned to right, experience toggle remains in menu */}
            <HeaderSherpa />
          </div>
        </div>
      </div>
      <div className="brand-accent-line"></div>

      {open && (
        <div className="nav:hidden border-t border-[var(--border-soft)] bg-[var(--surface-2)]">
          <div className="mx-auto max-w-none px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100dvh-90px)]">
            {hasHome && (
              <Link
                href="/home"
                className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] font-medium"
                onClick={() => setOpen(false)}
                suppressHydrationWarning
              >
                Home
              </Link>
            )}
            
            {Object.entries(NAVIGATION_GROUPS).map(([groupName, groupItems]) => (
              <div key={groupName} className="py-2">
                <div className="text-sm font-semibold text-muted mb-2 px-3">{groupName}</div>
                <div className="space-y-1">
                  {groupItems.map(({ href, label }) => {
                    const isActive = getActiveState(href)
                    const navHref = `/${href}`
                    return (
                      <Link
                        key={href}
                        href={navHref}
                        className={`block px-3 py-2 text-sm rounded-lg hover:bg-[var(--hover-bg)] transition-colors ${isActive ? 'font-semibold bg-[var(--hover-bg)]' : ''}`}
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
              </div>
            ))}
            
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
              <div data-testid="experience-controls-mobile" className="flex items-center gap-2">
                <ExperienceToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}