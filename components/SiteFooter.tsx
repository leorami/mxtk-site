'use client'

import ThemeSwitch from '@/components/ThemeSwitch'
import DevThemeSwitcher from '@/components/dev/DevThemeSwitcher'
import ExperienceToggle from '@/components/experience/ExperienceToggle'
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
            <div className="hidden md:flex ml-3 items-center" id="theme-buttons-container">
              <ThemeSwitch aria-label="Toggle theme" />
              {process.env.NODE_ENV !== "production" && (
                <div className="ml-1">
                  <DevThemeSwitcher />
                </div>
              )}
            </div>
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

        {/* Mobile layout: Light/dark mode on left, Experience toggle on right */}
        <div className="md:hidden w-full" style={{ minHeight: 'calc(56px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex justify-between items-center">
            <div className="mobile-theme-toggle">
              <ThemeSwitch aria-label="Toggle theme" />
            </div>
            <div className="mobile-experience-toggle" data-testid="mobile-experience-toggle">
              <ExperienceToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}