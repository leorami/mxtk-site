import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function WhitepaperPage() {
  return (
    <>
      <BackgroundPhoto variant="whitepaper" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
                Whitepaper
              </h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                This page summarizes the structure, oracle methodology, and market plumbing behind MXTK. A signed MDX/PDF will replace this sample content.
              </p>
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Design Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Transparency</h3>
                    <p className="text-muted">Every material statement about MXTK maps to a verifiable source: on-chain data, IPFS files, or documented methods.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Compliance</h3>
                    <p className="text-muted">Built for regulated markets with proper KYC/AML, custody, and reporting frameworks.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Liquidity</h3>
                    <p className="text-muted">Deep, stable markets through multiple venue support and institutional-grade infrastructure.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Governance</h3>
                    <p className="text-muted">Community-driven evolution with transparent decision-making and clear upgrade paths.</p>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <div className="container mx-auto px-4 py-10 md:py-12">
              <FeatureRow
                cols={3}
                items={[
                  { title: 'Documentation', body: 'JORC/NI43-101/SKR, chain-of-title, technical assessments.' },
                  { title: 'Verification', body: 'Independent review and third-party validation.' },
                  { title: 'Tokenization', body: 'Proper legal structure, custody, and on-chain representation.' },
                ]}
              />
            </div>

            <SectionWrapper index={3}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Oracle Governance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Methodology</h3>
                    <FeatureRow cols={2} items={[
                      { title: 'Transparent algorithms' },
                      { title: 'Multi-source aggregation' },
                      { title: 'Periodic review' },
                      { title: 'Community input' },
                    ]} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Governance</h3>
                    <FeatureRow cols={2} items={[
                      { title: 'Timelock upgrades' },
                      { title: 'Multi-sig controls' },
                      { title: 'Emergency pause' },
                      { title: 'Change logs' },
                    ]} />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={4}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Market Plumbing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">💱</div>
                    <h3 className="font-semibold mb-2">DEX Integration</h3>
                    <p className="text-muted text-sm">Uniswap v4 pools with concentrated liquidity and advanced AMM features</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">🏦</div>
                    <h3 className="font-semibold mb-2">OTC Markets</h3>
                    <p className="text-muted text-sm">Institutional-grade OTC desks with proper settlement and custody</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">🔗</div>
                    <h3 className="font-semibold mb-2">Cross-chain</h3>
                    <p className="text-muted text-sm">Multi-chain support for broader accessibility and liquidity</p>
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