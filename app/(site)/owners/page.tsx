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
    <PageTheme ink="light" lift="none" glass="standard">
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
                <div className="text-3xl font-bold mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-muted text-sm">Technical reports, legal documents, and financial records</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Access</h3>
                <p className="text-muted text-sm">Site visits, data room access, and expert consultations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20 6.5,20C8.45,20 10.55,20.4 12,21.5C13.35,20.65 15.8,20 17.5,20C19.15,20 20.85,20.3 22.25,21.05C22.35,21.1 22.4,21.1 22.5,21.1C22.75,21.1 23,20.85 23,20.6V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.65 12,19.5V8C13.35,7.15 15.8,6.5 17.5,6.5C18.7,6.5 19.9,6.65 21,7V18.5Z" />
                  </svg>
                </div>
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
                <div className="text-4xl font-bold mb-4 text-accent">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Discovery</h3>
                <p className="text-muted">Initial assessment and preliminary documentation review</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Verification</h3>
                <p className="text-muted">Independent review and technical validation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <path d="M2.81,14.12L5.64,11.29L8.47,14.12L7.06,15.53L3.5,12L7.06,8.47L8.47,9.88L5.64,12.71L2.81,9.88L1.39,11.29L4.22,14.12L1.39,16.95L2.81,18.36L5.64,15.53L8.47,18.36L9.88,16.95L7.05,14.12L9.88,11.29L8.47,9.88L5.64,12.71L2.81,9.88M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12Z" />
                  </svg>
                </div>
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
        <SectionWrapper index={5}>
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">Security & Compliance</h2>
            <FeatureGrid
              cols={3}
              items={[
                { title: 'Qualified custody', body: 'Institutional-grade controls and segregation.' },
                { title: 'Insurance coverage', body: 'Risk mitigation for stored assets.' },
                { title: 'Audit trails', body: 'Transparent, traceable on-chain activity.' },
              ]}
            />
          </Card>
        </SectionWrapper>

        {/* Benefits for Owners as Key Points */}
        <SectionWrapper index={6}>
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
          <SectionWrapper key={`${idx}-${mode}`} index={7 + idx}>
            <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
              <ModeTextSwap
                as="h2"
                depKey={`owners-sec-${idx}-heading-${mode}`}
                className="text-xl md:text-2xl font-semibold mb-6"
                content={sec.heading[mode]}
              />
              <div className="space-y-4">
                {sec.paragraphs[mode].map((p, i) => (
                  <ModeTextSwap
                    key={i}
                    as="p"
                    depKey={`owners-sec-${idx}-p-${i}-${mode}`}
                    className="leading-relaxed text-muted"
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
            </Card>
          </SectionWrapper>
        ))}

          
          </div>
        </div>
      </PageHero>
    </PageTheme>
  );
}