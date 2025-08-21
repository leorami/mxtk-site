// basePath is handled globally by Next.js (next.config.js). No manual prefixing needed here.

import Link from '@/components/ui/Link'

export default function SiteFooter() {
  return (
    <footer className="brand-footer">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted">
            © 2025 Mineral Token (MXTK). All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/disclosures">Disclosures</Link>
            <Link href="/media">Media</Link>
            <Link href="/the-team">Team</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}