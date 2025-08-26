'use client'

import { getRelativePath } from '@/lib/routing/basePath'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SiteFooter() {
  const pathname = usePathname() || '/'
  return (
    <footer className="brand-footer">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted">
            © 2025 Mineral Token (MXTK). All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href={getRelativePath("legal/terms", pathname)} suppressHydrationWarning>Terms</Link>
            <Link href={getRelativePath("legal/privacy", pathname)} suppressHydrationWarning>Privacy</Link>
            <Link href={getRelativePath("legal/disclosures", pathname)} suppressHydrationWarning>Disclosures</Link>
            <Link href={getRelativePath("media", pathname)} suppressHydrationWarning>Media</Link>
            <Link href={getRelativePath("the-team", pathname)} suppressHydrationWarning>Team</Link>
            <Link href={getRelativePath("careers", pathname)} suppressHydrationWarning>Careers</Link>
            <Link href={getRelativePath("contact-us", pathname)} suppressHydrationWarning>Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}