'use client'

import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function RoadmapPage() {
  const { mode, pageCopy } = useCopy('roadmap')
  return (
    <>
      <BackgroundPhoto variant="roadmap" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <ModeTextSwap as="h1" depKey={`roadmap-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[mode]} />
              <ModeTextSwap as="p" depKey={`roadmap-hero-sub-${mode}`} className="text-xl text-muted max-w-3xl mx-auto" content={pageCopy.heroSub[mode]} />
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <ModeTextSwap as="h2" depKey={`roadmap-p0-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[0]?.title[mode] || 'Q3-Q4 2025'} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">📋</div>
                    <h3 className="font-semibold mb-2">Initial Proofs</h3>
                    <p className="text-muted text-sm">Publish initial proofs set (redacted) and oracle v0.1 method (preview)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">🤝</div>
                    <h3 className="font-semibold mb-2">OTC Onboarding</h3>
                    <p className="text-muted text-sm">Onboard first OTC counterparties; begin monthly aggregates</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">🔒</div>
                    <h3 className="font-semibold mb-2">Security Setup</h3>
                    <p className="text-muted text-sm">Deploy multisig & timelock; post addresses</p>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <div className="container mx-auto px-4 py-10 md:py-12">
              <FeatureRow
                cols={3}
                items={[
                  { title: 'Expand proofs', body: 'Independent reviews where available.' },
                  { title: 'Live telemetry', body: 'Ops-cost and metrics from live feeds.' },
                  { title: 'Portal launch', body: 'Owner intake portal and media kit.' },
                ]}
              />
            </div>

            <SectionWrapper index={3}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Long-term Vision</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Market Infrastructure</h3>
                    <FeatureRow cols={2} items={[
                      { title: 'Uniswap v4 integration' },
                      { title: 'Liquidity management' },
                      { title: 'Cross-chain bridges' },
                      { title: 'Institutional custody' },
                    ]} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Ecosystem Growth</h3>
                    <FeatureRow cols={2} items={[
                      { title: 'Partner expansion' },
                      { title: 'Tooling & APIs' },
                      { title: 'Governance framework' },
                      { title: 'Education' },
                    ]} />
                  </div>
                </div>
              </Card>
            </SectionWrapper>
          </div>
        </div>
      </PageHero>
      {pageCopy.sections?.map((sec, idx) => (
        <section key={`${idx}-${mode}`} className="mt-10">
          <div className="glass glass--panel p-6 md:p-8 rounded-xl">
            <ModeTextSwap
              as="h2"
              depKey={`roadmap-sec-${idx}-heading-${mode}`}
              className="text-xl md:text-2xl font-semibold h-on-gradient"
              content={sec.heading[mode]}
            />
            <div className="mt-4 space-y-4 sub-on-gradient">
              {sec.paragraphs[mode].map((p, i) => (
                <ModeTextSwap
                  key={i}
                  as="p"
                  depKey={`roadmap-sec-${idx}-p-${i}-${mode}`}
                  className="leading-relaxed"
                  content={p}
                />
              ))}
            </div>
            {sec.highlight?.[mode] ? (
              <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                <ModeTextSwap
                  as="div"
                  depKey={`roadmap-sec-${idx}-hl-${mode}`}
                  className="text-sm opacity-90"
                  content={sec.highlight[mode]}
                />
              </div>
            ) : null}
          </div>
        </section>
      ))}
    </>
  )
}