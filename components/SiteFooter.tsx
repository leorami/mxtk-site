'use client'

import { withBase } from '@/lib/routing/basePath'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SiteFooter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="brand-footer">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted">
            © 2025 Mineral Token (MXTK). All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href={mounted ? withBase('/legal/terms') : '/legal/terms'}>Terms</Link>
            <Link href={mounted ? withBase('/legal/privacy') : '/legal/privacy'}>Privacy</Link>
            <Link href={mounted ? withBase('/legal/disclosures') : '/legal/disclosures'}>Disclosures</Link>
            <Link href={mounted ? withBase('/media') : '/media'}>Media</Link>
            <Link href={mounted ? withBase('/the-team') : '/the-team'}>Team</Link>
            <Link href={mounted ? withBase('/careers') : '/careers'}>Careers</Link>
            <Link href={mounted ? withBase('/contact-us') : '/contact-us'}>Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}