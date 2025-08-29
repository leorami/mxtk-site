import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function RoadmapPage() {
  return (
    <>
      <BackgroundPhoto variant="roadmap" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
                Roadmap
              </h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Indicative milestones subject to verification and partner timelines. Our path to building the future of mineral tokenization.
              </p>
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Q3-Q4 2025</h2>
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
    </>
  )
}