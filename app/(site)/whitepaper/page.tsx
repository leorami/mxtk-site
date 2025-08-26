import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'

export default function WhitepaperPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            Whitepaper
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            This page summarizes the structure, oracle methodology, and market plumbing behind MXTK. A signed MDX/PDF will replace this sample content.
          </p>
        </section>
      </PageHero>

      {/* Design Goals */}
      <section className="section-amber">
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
      </section>

      {/* Asset Admission */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Asset Admission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📋</div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-muted text-sm">JORC/NI43-101/SKR reports, chain-of-title, and technical assessments</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🔍</div>
              <h3 className="font-semibold mb-2">Verification</h3>
              <p className="text-muted text-sm">Independent review by qualified professionals and third-party validation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2">Tokenization</h3>
              <p className="text-muted text-sm">On-chain representation with proper legal structure and custody</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Oracle Governance */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Oracle Governance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Methodology</h3>
              <ul className="space-y-2 text-muted">
                <li>• Transparent pricing algorithms</li>
                <li>• Multi-source data aggregation</li>
                <li>• Regular review and updates</li>
                <li>• Community feedback integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Governance</h3>
              <ul className="space-y-2 text-muted">
                <li>• Timelock-protected upgrades</li>
                <li>• Multi-signature controls</li>
                <li>• Emergency pause mechanisms</li>
                <li>• Transparent change logs</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Market Plumbing */}
      <section className="section-amber">
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
      </section>
    </div>
  )
}