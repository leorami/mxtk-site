'use client'

import FooterChatBar from '@/components/ai/FooterChatBar'
import Link from 'next/link'

export default function SiteFooter() {

  return (
    <footer className="brand-footer relative z-10" style={{ minHeight: '64px' }}>
      <div className="mx-auto max-w-none px-4 py-3 relative">
        {/* Absolute-pinned chat dock on the right */}
        <div className="footer-chat-absolute" aria-hidden>
          <div className="footer-chat-dock"><FooterChatBar /></div>
        </div>

        <div className="hidden md:flex items-center justify-between gap-4 w-full pr-[calc(var(--guide-width)+1rem)]">
          {/* Left: Copyright */}
          <div className="text-sm text-muted footer-copyright">© 2025 Mineral Token (MXTK).</div>

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

        {/* Mobile layout: Chat stays pinned absolutely; links + copyright inline */}
        <div className="md:hidden w-full space-y-4 pr-[calc(var(--guide-width)+.75rem)]">
          <nav className="flex flex-wrap gap-3 text-sm justify-center">
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