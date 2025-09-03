import BasePathLink from '@/components/BasePathLink'
import OrganizationLogoGrid from '@/components/OrganizationLogoGrid'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
import { BulletList } from '@/components/ui/BulletList'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import PhotoBackdrop from '@/components/visuals/PhotoBackdrop'
import { PLACEHOLDER_PARTNERS_ECOSYSTEM } from '@/lib/placeholders'

export default function Ecosystem() {
  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <PhotoBackdrop src="art/photos/ecosystem_jade.jpg" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Blockchain & Contracts</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Arbitrum L2' },
                        { title: 'Uniswap v4' },
                        { title: 'Governance controls' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Data & Analytics</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Oracles' },
                        { title: 'Pool discovery' },
                        { title: 'Metrics & logs' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Developer Tools</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'APIs & ABIs' },
                        { title: 'Documentation' },
                        { title: 'SDKs' },
                      ]} 
                    />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Trading & Liquidity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Primary DEX</h3>
                    <p className="text-muted text-sm mb-4">Uniswap v4 on Arbitrum</p>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Concentrated liquidity' },
                        { title: 'Efficient pricing' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">OTC Markets</h3>
                    <p className="text-muted text-sm mb-4">Institutional execution and compliant settlement</p>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Factory/pool indexing' },
                        { title: 'Real-time metrics' },
                      ]} 
                    />
                  </div>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Wallets & Trackers</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Web3 wallets' },
                        { title: 'Portfolio apps' },
                        { title: 'Hardware wallets' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">KYC & Compliance</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Identity verification' },
                        { title: 'AML compliance' },
                        { title: 'Audit & reporting' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Custody & Security</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Institutional custody' },
                        { title: 'Multi-sig security' },
                        { title: 'Insurance coverage' },
                      ]} 
                    />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={4}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Mineral Industry Partners</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Mining Companies</h3>
                    <BulletList 
                      items={[
                        { title: 'Global mining operations' },
                        { title: 'Resource exploration' },
                        { title: 'Equipment providers' },
                        { title: 'Logistics & transport' },
                      ]} 
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Geological Services</h3>
                    <BulletList 
                      items={[
                        { title: 'JORC/NI 43-101 reports' },
                        { title: 'Independent assessments' },
                        { title: 'Resource estimation' },
                        { title: 'Environmental studies' },
                      ]} 
                    />
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
                <p className="mb-6" style={{color:'var(--ink-muted)'}}>
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
