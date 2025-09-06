'use client'

import ThemeSwitch from '@/components/ThemeSwitch'
import Link from 'next/link'

export default function SiteFooter() {

  return (
    <footer className="brand-footer relative z-10 footer-container" style={{ minHeight: '64px' }}>
      <div className="mx-auto max-w-none px-4 py-3 relative">
        {/* Footer Sherpa chat removed; header dropdown is primary */}

        <div className="hidden md:flex items-center justify-between gap-4 w-full ">
          {/* Left: Copyright */}
          <div className="text-sm text-muted footer-copyright">© 2025 Mineral Token (MXTK).</div>

          {/* Right: Legal links (reserve space with padding-right to avoid overlap) */}
          <nav className="flex items-center gap-4 text-sm ml-auto"><ThemeSwitch aria-label="Toggle theme" />
            <Link href="/legal/terms" suppressHydrationWarning>Terms</Link>
            <Link href="/legal/privacy" suppressHydrationWarning>Privacy</Link>
            <Link href="/legal/disclosures" suppressHydrationWarning>Disclosures</Link>
            <Link href="/media" suppressHydrationWarning>Media</Link>
            <Link href="/the-team" suppressHydrationWarning>Team</Link>
            <Link href="/careers" suppressHydrationWarning>Careers</Link>
            <Link href="/contact-us" suppressHydrationWarning>Contact</Link>
          </nav>
        </div>

        {/* Mobile layout: Chat stays pinned absolutely; links + copyright inline */}
        <div className="md:hidden w-full space-y-4 ">
          <nav className="flex flex-wrap gap-3 text-sm justify-center"><ThemeSwitch aria-label="Toggle theme" />
            <Link href="/legal/terms" suppressHydrationWarning>Terms</Link>
            <Link href="/legal/privacy" suppressHydrationWarning>Privacy</Link>
            <Link href="/legal/disclosures" suppressHydrationWarning>Disclosures</Link>
            <Link href="/media" suppressHydrationWarning>Media</Link>
            <Link href="/the-team" suppressHydrationWarning>Team</Link>
            <Link href="/careers" suppressHydrationWarning>Careers</Link>
            <Link href="/contact-us" suppressHydrationWarning>Contact</Link>
          </nav>

          <div className="text-xs text-muted text-center footer-copyright">© 2025 Mineral Token (MXTK).</div>
        </div>
      </div>
    </footer>
  )
}