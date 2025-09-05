'use client'

import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
// FullBleed removed per revert

import { useCopy } from '@/components/copy/Copy'
import ModeChangeFX from '@/components/experience/ModeChangeFX'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import JsonLd from '@/components/seo/JsonLd'
import { faqJsonLd } from '@/components/seo/faq'
import Card from '@/components/ui/Card'
import { KeyPoint, KeyPointsGrid } from '@/components/ui/KeyPoints'
import PageBackground from '@/components/visuals/PageBackground'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname() || '/'
  useEffect(() => { setMounted(true) }, [])

  const href = (path: string) => `/${path}`.replace(/\/{2,}/g, '/')
  const { mode, pageCopy } = useCopy('home')
  
  // For AI mode, fall back to build mode content until AI-specific content is added
  const contentMode = (mode === 'ai') ? 'build' : mode
  const faq = faqJsonLd(
    '/',
    [
      { q: 'What is MXTK?', a: 'A token representing validator-attested mineral value with institution-grade rails (settlement, custody, attestations).' },
      { q: 'Why is settlement faster?', a: 'Atomic DvP finalizes in seconds and eliminates manual end-of-day reconciliation.' },
      { q: 'Who validates minerals?', a: 'Independent validators under legal clawback with correlated slashing and optional insurance.' }
    ]
  )

  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <PageBackground page="home" />

      <JsonLd data={faq} />
      <ModeChangeFX mode={mode} />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
        {/* Hero */}
        <SectionWrapper index={0} className="text-center">
          <ModeTextSwap
            as="h1"
            depKey={`hero-title-${mode}`}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            content={pageCopy.heroTitle[contentMode]}
          />
          <ModeTextSwap
            as="p"
            depKey={`hero-sub-${mode}`}
            className="text-xl max-w-3xl mx-auto"
            content={pageCopy.heroSub[contentMode]}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="btn-primary" href={href('owners')} suppressHydrationWarning style={{ ['--accent' as any]: 'var(--mxtk-orange)' }}>Mineral Owners</Link>
            <Link className="btn-primary" href={href('transparency')} suppressHydrationWarning style={{ ['--accent' as any]: 'var(--mxtk-orange)' }}>Trust & Transparency</Link>
            <Link className="btn-primary" href={href('ecosystem')} suppressHydrationWarning style={{ ['--accent' as any]: 'var(--mxtk-orange)' }}>See the Ecosystem</Link>
          </div>
          
        </SectionWrapper>

        {/* Key Features */}
        <SectionWrapper index={1}>
          <Card tint="amber">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <ModeTextSwap
                  as="h2"
                  depKey={`p0-title-${mode}`}
                  className="text-2xl font-semibold mb-4"
                  content={pageCopy.pillars?.[0]?.title[contentMode]}
                />
                <ModeTextSwap
                  as="p"
                  depKey={`p0-body-${mode}`}
                  className="text-muted mb-4"
                  content={pageCopy.pillars?.[0]?.body[contentMode]}
                />
                <div className="mt-2">
                  <Link className="btn-link" href={href('whitepaper')} suppressHydrationWarning>How MXTK works</Link>
                </div>
              </div>
              <div>
                <ModeTextSwap
                  as="h2"
                  depKey={`p1-title-${mode}`}
                  className="text-2xl font-semibold mb-4"
                  content={pageCopy.pillars?.[1]?.title[contentMode]}
                />
                <ModeTextSwap
                  as="p"
                  depKey={`p1-body-${mode}`}
                  className="text-muted mb-4"
                  content={pageCopy.pillars?.[1]?.body[contentMode]}
                />
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
              <div className="text-center reveal copy-swap">
                <h3 className="font-semibold mb-2">Partners & Integrations</h3>
                <p className="text-muted text-sm">Comprehensive ecosystem supporting MXTK.</p>
                <Link className="btn-link" href={href('ecosystem')} suppressHydrationWarning>Explore</Link>
              </div>
              <div className="text-center reveal reveal-delayed-1 copy-swap">
                <h3 className="font-semibold mb-2">Educational Resources</h3>
                <p className="text-muted text-sm">Learn about tokenization and MXTK.</p>
                <Link className="btn-link" href={href('resources')} suppressHydrationWarning>Browse</Link>
              </div>
              <div className="text-center reveal reveal-delayed-2 copy-swap">
                <h3 className="font-semibold mb-2">Live Data</h3>
                <p className="text-muted text-sm">Real-time metrics and transparency.</p>
                <Link className="btn-link" href={href('transparency')} suppressHydrationWarning>View</Link>
              </div>
            </div>
            
            {/* Trust supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/home_support_trust.jpg', pathname)} alt="Amber trust mineral" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </SectionWrapper>

        
        {pageCopy.sections?.map((sec, idx) => (
          <SectionWrapper key={`${idx}-${mode}`} index={4 + idx}>
            <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
              <ModeTextSwap
                as="h2"
                depKey={`sec-${idx}-heading-${mode}`}
                className="text-xl md:text-2xl font-semibold mb-6"
                content={sec.heading[contentMode]}
              />
              <div className="space-y-4">
                {(sec.paragraphs[contentMode] || []).map((p, i) => (
                  <ModeTextSwap
                    key={i}
                    as="p"
                    depKey={`sec-${idx}-p-${i}-${mode}`}
                    className="leading-relaxed text-muted"
                    content={p}
                  />
                ))}
              </div>
              {sec.highlight?.[contentMode] ? (
                <div className="mt-5 rounded-lg px-4 py-3"
                     style={{ background: "rgba(255,255,255,0.10)" }}>
                  <ModeTextSwap
                    as="div"
                    depKey={`sec-${idx}-hl-${mode}`}
                    className="text-sm opacity-90"
                    content={sec.highlight[contentMode]}
                  />
                </div>
              ) : null}
            </Card>
          </SectionWrapper>
        ))}

        {/* Challenges as modern key points */}
        <SectionWrapper index={4 + (pageCopy.sections?.length || 0)}>
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