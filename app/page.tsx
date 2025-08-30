'use client'

import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
// FullBleed removed per revert
import { useBasePath } from '@/components/providers/BasePathProvider'
import Card from '@/components/ui/Card'
import { KeyPoint, KeyPointsGrid } from '@/components/ui/KeyPoints'
// import BackgroundBands from '@/components/visuals/BackgroundBands'
import PageBackground from '@/components/visuals/PageBackground'
import { usePublicPath } from '@/lib/routing/getPublicPathClient'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname() || '/'
  useEffect(() => { setMounted(true) }, [])
  const basePath = useBasePath() || ''
  const href = (path: string) => (`${basePath}/${path}`).replace(/\/{2,}/g, '/')

  return (
    <PageTheme ink="warm" lift="M">
      <PageBackground page="home" />

      <PageHero>
        <div className="relative">
          <div className="space-y-0">
        {/* Hero */}
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Tokenize and Monetize<br />
            <span className="text-accent">Verified Mineral Value</span>
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <img src={usePublicPath('icons/mineral/icon-facet.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
            <img src={usePublicPath('icons/mineral/icon-sparkle.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
            <img src={usePublicPath('icons/mineral/icon-lattice.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            MXTK offers compliant, confidential tokenization of mineral assets with transparent governance and verifiable on-chain data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="btn-soft" href={href('owners')} suppressHydrationWarning>Mineral Owners</Link>
            <Link className="btn-soft" href={href('transparency')} suppressHydrationWarning>Trust & Transparency</Link>
            <Link className="btn-soft" href={href('ecosystem')} suppressHydrationWarning>See the Ecosystem</Link>
          </div>
          
        </SectionWrapper>

        {/* Key Features */}
        <SectionWrapper index={1}>
          <Card tint="amber">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Compliant Tokenization</h2>
                <p className="text-muted mb-4">
                  MXTK provides a regulated path for mineral asset owners to tokenize their holdings while maintaining compliance with securities laws and regulatory requirements.
                </p>
                <div className="mt-2">
                  <Link className="btn-link" href={href('whitepaper')} suppressHydrationWarning>How MXTK works</Link>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Transparent Governance</h2>
                <p className="text-muted mb-4">
                  Every material statement about MXTK maps to a verifiable source: on-chain data, IPFS documents, or transparent methodologies.
                </p>
                <div className="mt-2">
                  <Link className="btn-link" href={href('transparency')} suppressHydrationWarning>Visit hub</Link>
                </div>
              </div>
            </div>
          </Card>
        </SectionWrapper>

        {/* Ecosystem Overview */}
        <SectionWrapper index={2}>
          <Card tint="teal">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center reveal">
                <h3 className="font-semibold mb-2">Partners & Integrations</h3>
                <p className="text-muted text-sm">Comprehensive ecosystem supporting MXTK.</p>
                <Link className="btn-link" href={href('ecosystem')} suppressHydrationWarning>Explore</Link>
              </div>
              <div className="text-center reveal reveal-delayed-1">
                <h3 className="font-semibold mb-2">Educational Resources</h3>
                <p className="text-muted text-sm">Learn about tokenization and MXTK.</p>
                <Link className="btn-link" href={href('resources')} suppressHydrationWarning>Browse</Link>
              </div>
              <div className="text-center reveal reveal-delayed-2">
                <h3 className="font-semibold mb-2">Live Data</h3>
                <p className="text-muted text-sm">Real-time metrics and transparency.</p>
                <Link className="btn-link" href={href('transparency')} suppressHydrationWarning>View</Link>
              </div>
            </div>
            
            {/* Trust supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/home_support_trust.jpg', pathname)} alt="Amber trust mineral" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </SectionWrapper>

        

        {/* Challenges as modern key points */}
        <SectionWrapper index={3}>
          <Card tint="teal">
            <KeyPointsGrid>
              <KeyPoint label="Challenge 1">Selling assets can lead to loss of ownership and control.</KeyPoint>
              <KeyPoint label="Challenge 2">Finding trustworthy buyers can be challenging.</KeyPoint>
              <KeyPoint label="Challenge 3">Traditional financing options are limited for both mined and unmined assets.</KeyPoint>
            </KeyPointsGrid>
          </Card>
        </SectionWrapper>

        
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}