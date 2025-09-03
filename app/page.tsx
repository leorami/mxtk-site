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
  const faq = faqJsonLd(
    '/',
    [
      { q: 'What is MXTK?', a: 'A token representing validator-attested mineral value with institution-grade rails (settlement, custody, attestations).' },
      { q: 'Why is settlement faster?', a: 'Atomic DvP finalizes in seconds and eliminates manual end-of-day reconciliation.' },
      { q: 'Who validates minerals?', a: 'Independent validators under legal clawback with correlated slashing and optional insurance.' }
    ]
  )

  return (
    <PageTheme ink="dark" lift="M" glass="soft">
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
            content={pageCopy.heroTitle[mode]}
          />
          <ModeTextSwap
            as="p"
            depKey={`hero-sub-${mode}`}
            className="text-xl max-w-3xl mx-auto"
            content={pageCopy.heroSub[mode]}
          />
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
                <ModeTextSwap
                  as="h2"
                  depKey={`p0-title-${mode}`}
                  className="text-2xl font-semibold mb-4"
                  content={pageCopy.pillars?.[0]?.title[mode]}
                />
                <ModeTextSwap
                  as="p"
                  depKey={`p0-body-${mode}`}
                  className="text-muted mb-4"
                  content={pageCopy.pillars?.[0]?.body[mode]}
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
                  content={pageCopy.pillars?.[1]?.title[mode]}
                />
                <ModeTextSwap
                  as="p"
                  depKey={`p1-body-${mode}`}
                  className="text-muted mb-4"
                  content={pageCopy.pillars?.[1]?.body[mode]}
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
          <section key={`${idx}-${mode}`} className="mt-10">
            <div className="glass glass--panel p-6 md:p-8 rounded-xl">
              <ModeTextSwap
                as="h2"
                depKey={`sec-${idx}-heading-${mode}`}
                className="text-xl md:text-2xl font-semibold h-on-gradient"
                content={sec.heading[mode]}
              />
              <div className="mt-4 space-y-4 sub-on-gradient">
                {sec.paragraphs[mode].map((p, i) => (
                  <ModeTextSwap
                    key={i}
                    as="p"
                    depKey={`sec-${idx}-p-${i}-${mode}`}
                    className="leading-relaxed"
                    content={p}
                  />
                ))}
              </div>
              {sec.highlight?.[mode] ? (
                <div className="mt-5 rounded-lg px-4 py-3"
                     style={{ background: "rgba(255,255,255,0.10)" }}>
                  <ModeTextSwap
                    as="div"
                    depKey={`sec-${idx}-hl-${mode}`}
                    className="text-sm opacity-90"
                    content={sec.highlight[mode]}
                  />
                </div>
              ) : null}
            </div>
          </section>
        ))}

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