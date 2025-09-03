'use client'


import Link from 'next/link'

export default function SiteFooter() {

  return (
    <footer className="brand-footer relative z-10">
      <div className="mx-auto max-w-none px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted">
            © 2025 Mineral Token (MXTK). All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/legal/terms" suppressHydrationWarning>Terms</Link>
            <Link href="/legal/privacy" suppressHydrationWarning>Privacy</Link>
            <Link href="/legal/disclosures" suppressHydrationWarning>Disclosures</Link>
            <Link href="/media" suppressHydrationWarning>Media</Link>
            <Link href="/the-team" suppressHydrationWarning>Team</Link>
            <Link href="/careers" suppressHydrationWarning>Careers</Link>
            <Link href="/contact-us" suppressHydrationWarning>Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}