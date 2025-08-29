'use client'

import { useBasePath } from '@/components/providers/BasePathProvider'
import Link from 'next/link'

export default function SiteFooter() {
  const basePath = useBasePath() || ''
  const href = (path: string) => (`${basePath}/${path}`).replace(/\/{2,}/g, '/')
  return (
    <footer className="brand-footer">
      <div className="mx-auto max-w-none px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted">
            © 2025 Mineral Token (MXTK). All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href={href('legal/terms')} suppressHydrationWarning>Terms</Link>
            <Link href={href('legal/privacy')} suppressHydrationWarning>Privacy</Link>
            <Link href={href('legal/disclosures')} suppressHydrationWarning>Disclosures</Link>
            <Link href={href('media')} suppressHydrationWarning>Media</Link>
            <Link href={href('the-team')} suppressHydrationWarning>Team</Link>
            <Link href={href('careers')} suppressHydrationWarning>Careers</Link>
            <Link href={href('contact-us')} suppressHydrationWarning>Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}