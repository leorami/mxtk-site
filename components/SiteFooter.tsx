'use client'

import ThemeSwitch from '@/components/ThemeSwitch'
import Link from 'next/link'

export default function SiteFooter() {

  return (
    <footer className="brand-footer relative z-10 footer-container site-footer" style={{ minHeight: '64px' }}>
      <div className="mx-auto max-w-none px-4 py-3 relative">
        {/* Footer Sherpa chat removed; header dropdown is primary */}

        <div className="hidden md:flex items-center justify-between gap-4 w-full ">
          {/* Left: Copyright + Theme switcher */}
          <div className="flex items-center gap-2">
            <div className="footer-brand text-sm">© 2025 Mineral Token (MXTK).</div>
            <div className="hidden md:block ml-3"><ThemeSwitch aria-label="Toggle theme" /></div>
          </div>

          {/* Right: Legal links (reserve space with padding-right to avoid overlap) */}
          <nav className="flex items-center gap-4 text-sm ml-auto">
            <Link href="/legal/terms" suppressHydrationWarning>Terms</Link>
            <Link href="/legal/privacy" suppressHydrationWarning>Privacy</Link>
            <Link href="/legal/disclosures" suppressHydrationWarning>Disclosures</Link>
            <Link href="/media" suppressHydrationWarning>Media</Link>
            <Link href="/the-team" suppressHydrationWarning>Team</Link>
            <Link href="/careers" suppressHydrationWarning>Careers</Link>
            <Link href="/contact-us" suppressHydrationWarning>Contact</Link>
          </nav>
        </div>

        {/* Mobile layout: keep footer visually empty; reserve height incl. safe area */}
        <div className="md:hidden w-full" style={{ minHeight: 'calc(56px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {/* Intentionally empty on mobile: links live in hamburger; no copyright */}
        </div>
      </div>
    </footer>
  )
}