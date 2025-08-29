import BasePathLink from '@/components/BasePathLink'
import OrganizationLogoGrid from '@/components/OrganizationLogoGrid'
import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'
import { BulletItem, BulletList } from '@/components/ui/List'
import { PLACEHOLDER_PARTNERS_ECOSYSTEM } from '@/lib/placeholders'

export default function Ecosystem() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">MXTK Ecosystem</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            A comprehensive ecosystem of partners, integrations, and infrastructure supporting Mineral Token's mission to unlock liquidity for global mineral holdings.
          </p>
        </section>
      </PageHero>

      {/* Core Infrastructure */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Core Infrastructure</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-3">Blockchain & Smart Contracts</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Network: Arbitrum One (Layer 2)" />
                  <BulletItem title="Token Address: 0x3e4Ffeb394b371aaaa0998488046ca19d870d9Ba" />
                  <BulletItem title="DEX: Uniswap v4 pools (auto-discovered)" />
                  <BulletItem title="Security: LP lock & timelock multisig (planned)" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Data & Analytics</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Price Feeds: Real-time oracle data" />
                  <BulletItem title="Indexers: Factory + pool discovery" />
                  <BulletItem title="Metrics: TVL, volume, liquidity tracking" />
                  <BulletItem title="Transparency: Public oracle logs" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Developer Tools</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="API: Pool discovery endpoints" />
                  <BulletItem title="ABIs: Smart contract interfaces" />
                  <BulletItem title="Documentation: Technical guides" />
                  <BulletItem title="SDKs: Integration libraries" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Trading & Liquidity */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Trading & Liquidity</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Decentralized Exchanges</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Uniswap v4 (Arbitrum) - Primary DEX">
                    <a 
                      href="https://app.uniswap.org/explore/tokens/arbitrum/0x3e4ffeb394b371aaaa0998488046ca19d870d9ba" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Link to token
                    </a>
                  </BulletItem>
                  <BulletItem title="Automated market making with concentrated liquidity" />
                  <BulletItem title="Low fees and high efficiency" />
                  <BulletItem title="Real-time price discovery" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Over-the-Counter (OTC)</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Institutional-grade trading" />
                  <BulletItem title="KYC/AML compliant escrow services" />
                  <BulletItem title="Large block trading capabilities" />
                  <BulletItem title="Custom settlement terms" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Partners & Integrations */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Partners & Integrations</h2>
          
          {/* Partner Logos */}
          <OrganizationLogoGrid
            organizations={PLACEHOLDER_PARTNERS_ECOSYSTEM}
            title="Strategic Partners"
            subtitle="Key partners supporting the MXTK ecosystem"
            size="lg"
            columns={4}
            className="mb-8"
          />
          
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-3">Wallets & Portfolio Trackers</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="MetaMask & other Web3 wallets" />
                  <BulletItem title="Portfolio tracking apps" />
                  <BulletItem title="Mobile wallet support" />
                  <BulletItem title="Hardware wallet integration" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">KYC & Compliance</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Identity verification services" />
                  <BulletItem title="AML screening & monitoring" />
                  <BulletItem title="Regulatory compliance tools" />
                  <BulletItem title="Audit & reporting systems" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Custody & Security</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Institutional-grade custody" />
                  <BulletItem title="Multi-signature security" />
                  <BulletItem title="Insurance coverage" />
                  <BulletItem title="Cold storage solutions" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Mineral Industry Partners */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Mineral Industry Partners</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Mining Companies</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Global mining operations" />
                  <BulletItem title="Resource exploration companies" />
                  <BulletItem title="Mining equipment providers" />
                  <BulletItem title="Logistics and transportation" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Geological Services</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="JORC/NI 43-101 compliant reports" />
                  <BulletItem title="Independent geological assessments" />
                  <BulletItem title="Resource estimation services" />
                  <BulletItem title="Environmental impact studies" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Financial Services */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Financial Services</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-3">Traditional Finance</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Investment banks" />
                  <BulletItem title="Asset management firms" />
                  <BulletItem title="Hedge funds" />
                  <BulletItem title="Family offices" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">DeFi Protocols</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Lending platforms" />
                  <BulletItem title="Yield farming protocols" />
                  <BulletItem title="Derivatives exchanges" />
                  <BulletItem title="Insurance protocols" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Regulatory & Compliance</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Legal counsel" />
                  <BulletItem title="Compliance consultants" />
                  <BulletItem title="Audit firms" />
                  <BulletItem title="Regulatory advisors" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Developer Resources */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Developer Resources</h2>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-3">API Endpoints</h3>
                <div className="text-sm">
                  <BulletList>
                    <BulletItem title="/api/pools?auto=1 - Pool discovery" />
                    <BulletItem title="/api/token/summary - Token data" />
                    <BulletItem title="/api/oracle/logs - Oracle feeds" />
                    <BulletItem title="/api/otc/aggregates - OTC data" />
                  </BulletList>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Smart Contract ABIs</h3>
                <div className="text-sm">
                  <BulletList>
                    <BulletItem title="ERC-20 token interface" />
                    <BulletItem title="Uniswap v4 pool interface" />
                    <BulletItem title="Oracle contract interface" />
                    <BulletItem title="Governance contract interface" />
                  </BulletList>
                </div>
              </div>
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
      </section>

      {/* Join the Ecosystem */}
      <section className="section-amber">
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
      </section>
    </div>
  )
}
