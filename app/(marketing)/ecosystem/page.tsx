import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function Ecosystem() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">MXTK Ecosystem</h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          A comprehensive ecosystem of partners, integrations, and infrastructure supporting Mineral Token's mission to unlock liquidity for global mineral holdings.
        </p>
      </section>

      {/* Core Infrastructure */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Core Infrastructure</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-3">Blockchain & Smart Contracts</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li><strong>Network:</strong> Arbitrum One (Layer 2)</li>
                <li><strong>Token Address:</strong> <code className="font-mono text-xs">0x3e4Ffeb394b371aaaa0998488046ca19d870d9Ba</code></li>
                <li><strong>DEX:</strong> Uniswap v3 pools (auto-discovered)</li>
                <li><strong>Security:</strong> LP lock & timelock multisig (planned)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Data & Analytics</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li><strong>Price Feeds:</strong> Real-time oracle data</li>
                <li><strong>Indexers:</strong> Factory + pool discovery</li>
                <li><strong>Metrics:</strong> TVL, volume, liquidity tracking</li>
                <li><strong>Transparency:</strong> Public oracle logs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Developer Tools</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li><strong>API:</strong> Pool discovery endpoints</li>
                <li><strong>ABIs:</strong> Smart contract interfaces</li>
                <li><strong>Documentation:</strong> Technical guides</li>
                <li><strong>SDKs:</strong> Integration libraries</li>
              </ul>
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
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <a 
                    href="https://app.uniswap.org/explore/tokens/arbitrum/0x3e4ffeb394b371aaaa0998488046ca19d870d9ba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Uniswap v3 (Arbitrum) - Primary DEX
                  </a>
                </li>
                <li>Automated market making with concentrated liquidity</li>
                <li>Low fees and high efficiency</li>
                <li>Real-time price discovery</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Over-the-Counter (OTC)</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Institutional-grade trading</li>
                <li>KYC/AML compliant escrow services</li>
                <li>Large block trading capabilities</li>
                <li>Custom settlement terms</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Partners & Integrations */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Partners & Integrations</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-3">Wallets & Portfolio Trackers</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>MetaMask & other Web3 wallets</li>
                <li>Portfolio tracking apps</li>
                <li>Mobile wallet support</li>
                <li>Hardware wallet compatibility</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Custody & Security</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Institutional custody solutions</li>
                <li>Multi-signature security</li>
                <li>Cold storage options</li>
                <li>Insurance coverage</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Analytics & Risk Tools</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Real-time market data</li>
                <li>Risk assessment tools</li>
                <li>Portfolio analytics</li>
                <li>Compliance monitoring</li>
              </ul>
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
              <ul className="space-y-2 text-sm text-muted">
                <li>Global mining operations</li>
                <li>Resource exploration companies</li>
                <li>Mining equipment providers</li>
                <li>Logistics and transportation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Geological Services</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>JORC/NI 43-101 compliant reports</li>
                <li>Independent geological assessments</li>
                <li>Resource estimation services</li>
                <li>Environmental impact studies</li>
              </ul>
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
              <ul className="space-y-2 text-sm text-muted">
                <li>Investment banks</li>
                <li>Asset management firms</li>
                <li>Hedge funds</li>
                <li>Family offices</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">DeFi Protocols</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Lending platforms</li>
                <li>Yield farming protocols</li>
                <li>Derivatives exchanges</li>
                <li>Insurance protocols</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Regulatory & Compliance</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>Legal counsel</li>
                <li>Compliance consultants</li>
                <li>Audit firms</li>
                <li>Regulatory advisors</li>
              </ul>
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
                <ul className="space-y-2 text-sm text-muted">
                  <li><code className="font-mono">/api/pools?auto=1</code> - Pool discovery</li>
                  <li><code className="font-mono">/api/token/summary</code> - Token data</li>
                  <li><code className="font-mono">/api/oracle/logs</code> - Oracle feeds</li>
                  <li><code className="font-mono">/api/otc/aggregates</code> - OTC data</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Smart Contract ABIs</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>ERC-20 token interface</li>
                  <li>Uniswap v3 pool interface</li>
                  <li>Oracle contract interface</li>
                  <li>Governance contract interface</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted mb-4">
                For comprehensive developer documentation, visit our{' '}
                <Link href="/resources" className="text-accent hover:underline">
                  Resources page
                </Link>
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
            <Link href="/contact-us" className="btn-soft">
              Partner with Us
            </Link>
            <Link href="/resources" className="btn-outline">
              Developer Resources
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
