'use client'

import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'
import { getPublicPath, getRelativePath } from '@/lib/routing/basePath'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname() || '/'
  useEffect(() => { setMounted(true) }, [])

  return (
    <PageHero>
      <div className="space-y-16">
        {/* Hero */}
        <section className="text-center space-y-8 pt-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-950 dark:text-gray-50">
            Tokenize and Monetize<br />
            <span className="text-accent">Verified Mineral Value</span>
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <img src={getPublicPath('icons/mineral/icon-facet.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-sparkle.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-lattice.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
            MXTK offers compliant, confidential tokenization of mineral assets with transparent governance and verifiable on-chain data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="btn-soft" href={getRelativePath('owners', pathname)} suppressHydrationWarning>Mineral Owners</Link>
            <Link className="btn-soft" href={getRelativePath('transparency', pathname)} suppressHydrationWarning>Trust & Transparency</Link>
            <Link className="btn-soft" href={getRelativePath('ecosystem', pathname)} suppressHydrationWarning>See the Ecosystem</Link>
          </div>
          
          {/* Hero supporting image - temporarily removed for cleaner look */}
          {/* <img src={getPublicPath('minerals/supporting/home_support_hero.jpg', pathname)} alt="Amber hero mineral" className="w-full rounded-xl shadow-lg my-6" loading="lazy" /> */}
        </section>

        {/* Key Features */}
        <section className="glass">
          <Card tint="amber">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Compliant Tokenization</h2>
                <p className="text-muted mb-4">
                  MXTK provides a regulated path for mineral asset owners to tokenize their holdings while maintaining compliance with securities laws and regulatory requirements.
                </p>
                <div className="mt-2">
                  <Link className="btn-link" href={getRelativePath('whitepaper', pathname)} suppressHydrationWarning>How MXTK works</Link>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Transparent Governance</h2>
                <p className="text-muted mb-4">
                  Every material statement about MXTK maps to a verifiable source: on-chain data, IPFS documents, or transparent methodologies.
                </p>
                <div className="mt-2">
                  <Link className="btn-link" href={getRelativePath('transparency', pathname)} suppressHydrationWarning>Visit hub</Link>
                </div>
              </div>
            </div>
            
            {/* Methodology supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/home_support_method.jpg', pathname)} alt="Amber flow mineral" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </section>

        {/* Ecosystem Overview */}
        <section className="glass">
          <Card tint="teal">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Partners & Integrations</h3>
                <p className="text-muted text-sm">Comprehensive ecosystem supporting MXTK.</p>
                <Link className="btn-link" href={getRelativePath('ecosystem', pathname)} suppressHydrationWarning>Explore</Link>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Educational Resources</h3>
                <p className="text-muted text-sm">Learn about tokenization and MXTK.</p>
                <Link className="btn-link" href={getRelativePath('resources', pathname)} suppressHydrationWarning>Browse</Link>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Live Data</h3>
                <p className="text-muted text-sm">Real-time metrics and transparency.</p>
                <Link className="btn-link" href={getRelativePath('transparency', pathname)} suppressHydrationWarning>View</Link>
              </div>
            </div>
            
            {/* Trust supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/home_support_trust.jpg', pathname)} alt="Amber trust mineral" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </section>
      </div>
    </PageHero>
  )
}