'use client'

import PageHero from '@/components/PageHero';
import SectionWrapper from '@/components/SectionWrapper';
// FullBleed removed per revert
import { useCopy } from '@/components/copy/Copy';
import ModeTextSwap from '@/components/experience/ModeTextSwap';
import JsonLd from '@/components/seo/JsonLd';
import { faqJsonLd } from '@/components/seo/faq';
import PageTheme from '@/components/theme/PageTheme';
import Card from '@/components/ui/Card';
import FeatureGrid from '@/components/ui/FeatureGrid';
import { KeyPoint, KeyPointsGrid } from '@/components/ui/KeyPoints';
import PageBackground from '@/components/visuals/PageBackground';

import { usePathname } from 'next/navigation';

export default function OwnersPage() {
  const pathname = usePathname() || '/'
  const { mode, pageCopy } = useCopy('owners')
  const faq = faqJsonLd(
    '/owners',
    [
      { q: 'Who is this for?', a: 'Mineral owners and operators seeking compliant tokenization pathways.' },
      { q: 'What do we consider?', a: 'Aligned incentives, flexible terms, and project-backed mechanics.' },
      { q: 'What is the process?', a: 'Discovery, independent verification, then onboarding.' }
    ]
  )
  return (
    <PageTheme ink="dark" lift="M" glass="soft">
      <JsonLd data={faq} />
      <PageBackground page="owners" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
        {/* Hero */}
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            For Mineral Owners
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            MXTK offers a compliant, confidential intake path for owners and operators seeking to digitize mineral interests and participate in a transparent, governed token economy.
          </p>
        </SectionWrapper>

        {/* What We Consider */}
        <SectionWrapper index={1}>
          <Card tint="amber">
            <ModeTextSwap as="h2" depKey={`owners-p0-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[0]?.title[mode] || 'What We Consider'} />
            <FeatureGrid
              cols={3}
              items={[
                { title: 'Aligned incentives', body: pageCopy.pillars?.[0]?.body[mode] || 'Structures designed to protect long-term asset value.' },
                { title: 'Flexible repayment', body: pageCopy.pillars?.[1]?.body[mode] || 'Terms optimized for project reality and timing.' },
                { title: 'No personal guarantees', body: pageCopy.pillars?.[2]?.body[mode] || 'Project-backed mechanics without personal liability.' },
              ]}
            />
            
            {/* What We Consider supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/owners_support_facets.jpg', pathname)} alt="Citrine facets" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </SectionWrapper>

        

        {/* What You Provide */}
        <SectionWrapper index={2}>
          <Card tint="teal">
            <ModeTextSwap as="h2" depKey={`owners-p1-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[1]?.title[mode] || 'What You Provide'} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">📋</div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-muted text-sm">Technical reports, legal documents, and financial records</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">🔍</div>
                <h3 className="font-semibold mb-2">Access</h3>
                <p className="text-muted text-sm">Site visits, data room access, and expert consultations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Cooperation</h3>
                <p className="text-muted text-sm">Due diligence support and ongoing communication</p>
              </div>
            </div>
          </Card>
        </SectionWrapper>

        {/* Process Steps */}
        <SectionWrapper index={3}>
          <Card tint="navy">
            <ModeTextSwap as="h2" depKey={`owners-p2-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[2]?.title[mode] || 'Our Process'} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">🔍</div>
                <h3 className="text-xl font-semibold mb-3">Discovery</h3>
                <p className="text-muted">Initial assessment and preliminary documentation review</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">✅</div>
                <h3 className="text-xl font-semibold mb-3">Verification</h3>
                <p className="text-muted">Independent review and technical validation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Onboarding</h3>
                <p className="text-muted">Tokenization and market integration</p>
              </div>
            </div>
            
            {/* Process supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/owners_support_veins.jpg', pathname)} alt="Citrine veins" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </SectionWrapper>

        {/* Field Verification */}
        <SectionWrapper index={4}>
          <Card tint="amber">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Field Verification</h3>
              <p className="text-muted mb-4">
                Our team conducts thorough field assessments to verify mineral claims and ensure compliance with industry standards. This includes on-site inspections, sample collection, and documentation review.
              </p>
              <p className="text-muted text-sm">
                Every mineral asset undergoes rigorous evaluation before being considered for tokenization, ensuring transparency and accuracy in our reporting.
              </p>
            </div>
          </Card>
        </SectionWrapper>

        {/* Consolidated grid */}
        <section className="glass">
          <Card tint="amber">
            <FeatureGrid
              cols={3}
              items={[
                { title: 'Qualified custody', body: 'Institutional-grade controls and segregation.' },
                { title: 'Insurance coverage', body: 'Risk mitigation for stored assets.' },
                { title: 'Audit trails', body: 'Transparent, traceable on-chain activity.' },
              ]}
            />
          </Card>
        </section>

        {/* Benefits for Owners as Key Points */}
        <SectionWrapper index={5}>
          <Card tint="teal">
            <h2 className="text-2xl font-semibold mb-6">Benefits for Owners</h2>
            <KeyPointsGrid>
              <KeyPoint label="Liquidity">Access to global capital markets and trading liquidity.</KeyPoint>
              <KeyPoint label="Value Discovery">Market-driven pricing and transparent valuation.</KeyPoint>
              <KeyPoint label="Security">Blockchain-based ownership and transfer security.</KeyPoint>
            </KeyPointsGrid>
          </Card>
        </SectionWrapper>

        {pageCopy.sections?.map((sec, idx) => (
          <section key={`${idx}-${mode}`} className="mt-10">
            <div className="glass glass--panel p-6 md:p-8 rounded-xl">
              <ModeTextSwap
                as="h2"
                depKey={`owners-sec-${idx}-heading-${mode}`}
                className="text-xl md:text-2xl font-semibold h-on-gradient"
                content={sec.heading[mode]}
              />
              <div className="mt-4 space-y-4 sub-on-gradient">
                {sec.paragraphs[mode].map((p, i) => (
                  <ModeTextSwap
                    key={i}
                    as="p"
                    depKey={`owners-sec-${idx}-p-${i}-${mode}`}
                    className="leading-relaxed"
                    content={p}
                  />
                ))}
              </div>
              {sec.highlight?.[mode] ? (
                <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <ModeTextSwap
                    as="div"
                    depKey={`owners-sec-${idx}-hl-${mode}`}
                    className="text-sm opacity-90"
                    content={sec.highlight[mode]}
                  />
                </div>
              ) : null}
            </div>
          </section>
        ))}

          
          </div>
        </div>
      </PageHero>
    </PageTheme>
  );
}