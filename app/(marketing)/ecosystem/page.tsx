import BasePathLink from '@/components/BasePathLink'
import OrganizationLogoGrid from '@/components/OrganizationLogoGrid'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
import { PLACEHOLDER_PARTNERS_ECOSYSTEM } from '@/lib/placeholders'

export default function Ecosystem() {
  return (
    <PageTheme ink="warm" lift="M">
      <BackgroundPhoto variant="ecosystem" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">MXTK Ecosystem</h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                A comprehensive ecosystem of partners, integrations, and infrastructure supporting Mineral Token's mission to unlock liquidity for global mineral holdings.
              </p>
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Core Infrastructure</h2>
                <FeatureRow cols={3} items={[
                  { title: 'Blockchain & contracts', body: 'Arbitrum L2, Uniswap v4, governance controls.' },
                  { title: 'Data & analytics', body: 'Oracles, pool discovery, metrics & logs.' },
                  { title: 'Developer tools', body: 'APIs, ABIs, docs, and SDKs.' },
                ]} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Trading & Liquidity</h2>
                <FeatureRow cols={2} items={[
                  { title: 'Primary DEX', body: 'Uniswap v4 on Arbitrum.' },
                  { title: 'OTC', body: 'Institutional execution and compliant settlement.' },
                  { title: 'AMM', body: 'Concentrated liquidity; efficient pricing.' },
                  { title: 'Discovery', body: 'Factory/pool indexing and real-time metrics.' },
                ]} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6">Partners & Integrations</h2>
                <OrganizationLogoGrid
                  organizations={PLACEHOLDER_PARTNERS_ECOSYSTEM}
                  title="Strategic Partners"
                  subtitle="Key partners supporting the MXTK ecosystem"
                  size="lg"
                  columns={4}
                  className="mb-8"
                />
                <FeatureRow cols={3} items={[
                  { title: 'Wallets & trackers', body: 'Web3 wallets, portfolio apps, hardware.' },
                  { title: 'KYC & compliance', body: 'Identity, AML, audit & reporting.' },
                  { title: 'Custody & security', body: 'Institutional custody, multi-sig, insurance.' },
                ]} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={4}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Mineral Industry Partners</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Mining Companies</h3>
                    <FeatureRow cols={2} items={[
                      { title: 'Global mining operations' },
                      { title: 'Resource exploration' },
                      { title: 'Equipment providers' },
                      { title: 'Logistics & transport' },
                    ]} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Geological Services</h3>
                    <FeatureRow cols={2} items={[
                      { title: 'JORC/NI 43-101 reports' },
                      { title: 'Independent assessments' },
                      { title: 'Resource estimation' },
                      { title: 'Environmental studies' },
                    ]} />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={5}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Financial Services</h2>
                <FeatureRow cols={3} items={[
                  { title: 'Traditional finance', body: 'Banks, asset managers, funds, family offices.' },
                  { title: 'DeFi protocols', body: 'Lending, derivatives, yield, insurance.' },
                  { title: 'Regulatory & compliance', body: 'Legal, consultants, audit, advisors.' },
                ]} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={6}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6">Developer Resources</h2>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FeatureRow cols={2} items={[
                      { title: 'API endpoints', body: 'Pools, token summary, oracle logs, OTC aggregates.' },
                      { title: 'Smart contract ABIs', body: 'ERC-20, Uniswap v4, oracle, governance.' },
                    ]} />
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted mb-4">
                      For comprehensive developer documentation, visit our{' '}
                      <BasePathLink to="resources" className="text-accent hover:underline">
                        Resources page
                      </BasePathLink>
                      .
                    </p>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={7}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Join the Ecosystem</h2>
                <p className="text-muted mb-6">
                  Interested in partnering with Mineral Token? We're always looking for innovative companies and developers to join our ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <BasePathLink to="contact-us" className="btn-soft">
                    Partner with Us
                  </BasePathLink>
                  <BasePathLink to="resources" className="btn-outline">
                    Developer Resources
                  </BasePathLink>
                </div>
              </Card>
            </SectionWrapper>
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}
