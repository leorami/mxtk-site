import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import Card from '@/components/ui/Card'

export default function InstitutionsPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          For Traders & Institutions
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          MXTK offers institutional-grade infrastructure for trading and custody of tokenized mineral interests, with transparent pricing and deep liquidity.
        </p>
      </section>

      {/* Token Information */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
          <OnchainSummary />
        </Card>
      </section>

      {/* Liquidity Pools */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
          <PoolTable />
        </Card>
      </section>

      {/* Infrastructure */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Infrastructure & Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Smart Contracts</h3>
              <ul className="space-y-2 text-muted">
                <li>• Token (Arbitrum): 0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba</li>
                <li>• Uniswap v4 Pool: Coming soon</li>
                <li>• LP Locker: Coming soon</li>
                <li>• Multisig: 3-of-5 governance</li>
                <li>• Timelock: 48-hour delay</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Security Features</h3>
              <ul className="space-y-2 text-muted">
                <li>• Multi-signature governance</li>
                <li>• Timelock-protected upgrades</li>
                <li>• Emergency pause mechanisms</li>
                <li>• Regular security audits</li>
                <li>• Transparent change logs</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Trading Features */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Trading Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">💱</div>
              <h3 className="font-semibold mb-2">DEX Trading</h3>
                              <p className="text-muted text-sm">Uniswap v4 pools with concentrated liquidity and advanced AMM features</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🏦</div>
              <h3 className="font-semibold mb-2">OTC Markets</h3>
              <p className="text-muted text-sm">Institutional-grade OTC desks with proper settlement and custody</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2">Price Feeds</h3>
              <p className="text-muted text-sm">Transparent oracle pricing with documented methodology</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Compliance */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Compliance & Custody</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Regulatory Framework</h3>
              <ul className="space-y-2 text-muted">
                <li>• KYC/AML compliance</li>
                <li>• Institutional custody</li>
                <li>• Regulatory reporting</li>
                <li>• Tax documentation</li>
                <li>• Legal structure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Custody Solutions</h3>
              <ul className="space-y-2 text-muted">
                <li>• Qualified custodian support</li>
                <li>• Multi-signature controls</li>
                <li>• Insurance coverage</li>
                <li>• Audit trails</li>
                <li>• Settlement automation</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}