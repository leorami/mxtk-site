import Card from '@/components/ui/Card'

export default function RoadmapPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Roadmap
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Indicative milestones subject to verification and partner timelines. Our path to building the future of mineral tokenization.
        </p>
      </section>

      {/* Current Quarter */}
      <section className="section-amber">
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
      </section>

      {/* Next Quarters */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Next 2-3 Quarters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📈</div>
              <h3 className="font-semibold mb-2">Expand Proofs</h3>
              <p className="text-muted text-sm">Expand proofs set; post independent reviews where available</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2">Live Telemetry</h3>
              <p className="text-muted text-sm">Switch ops-cost widget to live telemetry</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🚀</div>
              <h3 className="font-semibold mb-2">Portal Launch</h3>
              <p className="text-muted text-sm">Launch owner intake portal and media kit</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Long-term Vision */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Long-term Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Market Infrastructure</h3>
              <ul className="space-y-2 text-muted">
                <li>• Uniswap v3 integration</li>
                <li>• Advanced liquidity management</li>
                <li>• Cross-chain bridge development</li>
                <li>• Institutional custody solutions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Ecosystem Growth</h3>
              <ul className="space-y-2 text-muted">
                <li>• Partner network expansion</li>
                <li>• Developer tooling and APIs</li>
                <li>• Community governance framework</li>
                <li>• Educational initiatives</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}