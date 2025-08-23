import Card from '@/components/ui/Card'

export default function OwnersPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          For Mineral Owners
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          MXTK offers a compliant, confidential intake path for owners and operators seeking to digitize mineral interests and participate in a transparent, governed token economy.
        </p>
      </section>

      {/* What We Consider */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">What We Consider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Geological Documentation</h3>
              <ul className="space-y-2 text-muted">
                <li>• JORC/NI43-101 technical reports</li>
                <li>• Resource and reserve estimates</li>
                <li>• Geological modeling and analysis</li>
                <li>• Exploration and development plans</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal & Financial</h3>
              <ul className="space-y-2 text-muted">
                <li>• Chain-of-title verification</li>
                <li>• Mineral rights documentation</li>
                <li>• Financial statements and projections</li>
                <li>• Regulatory compliance status</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* What You Provide */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">What You Provide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📋</div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-muted text-sm">Technical reports, legal documents, and financial records</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🔍</div>
              <h3 className="font-semibold mb-2">Access</h3>
              <p className="text-muted text-sm">Site visits, data room access, and expert consultations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🤝</div>
              <h3 className="font-semibold mb-2">Cooperation</h3>
              <p className="text-muted text-sm">Due diligence support and ongoing communication</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Process Steps */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-4 text-accent">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Discovery</h3>
              <p className="text-muted">Initial assessment and preliminary documentation review</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-4 text-accent">✅</div>
              <h3 className="text-xl font-semibold mb-3">Verification</h3>
              <p className="text-muted">Independent review and technical validation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-4 text-accent">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Onboarding</h3>
              <p className="text-muted">Tokenization and market integration</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Confidentiality */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Confidentiality</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Data Protection</h3>
              <ul className="space-y-2 text-muted">
                <li>• Secure data room access</li>
                <li>• Non-disclosure agreements</li>
                <li>• Redacted public disclosures</li>
                <li>• Controlled information flow</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Privacy Controls</h3>
              <ul className="space-y-2 text-muted">
                <li>• Owner identity protection</li>
                <li>• Sensitive data redaction</li>
                <li>• Limited public exposure</li>
                <li>• Confidential settlement terms</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Benefits */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Benefits for Owners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">💰</div>
              <h3 className="font-semibold mb-2">Liquidity</h3>
              <p className="text-muted text-sm">Access to global capital markets and trading liquidity</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📈</div>
              <h3 className="font-semibold mb-2">Value Discovery</h3>
              <p className="text-muted text-sm">Market-driven pricing and transparent valuation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-muted text-sm">Blockchain-based ownership and transfer security</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}