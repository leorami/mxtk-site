'use client'

import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import ProofTable from '@/components/ProofTable'
import Card from '@/components/ui/Card'
import { PLACEHOLDER_PROOFS } from '@/lib/placeholders'
import { withBase } from '@/lib/routing/basePath'
import Link from 'next/link'

export default function TransparencyPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Trust & Transparency
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Every material statement about MXTK should map to a source: a file, an address, or a method. Until a claim is evidenced, it stays clearly labeled as preview.
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

      {/* Attestations & Audits */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Attestations & Audits</h2>
          <ProofTable proofs={PLACEHOLDER_PROOFS} />
        </Card>
      </section>

      {/* Additional Resources */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📄</div>
              <h3 className="font-semibold mb-2">Whitepaper</h3>
              <p className="text-muted text-sm mb-4">Technical documentation and methodology</p>
              <Link className="btn-soft" href={withBase("/whitepaper")}>Read Whitepaper</Link>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🗺️</div>
              <h3 className="font-semibold mb-2">Roadmap</h3>
              <p className="text-muted text-sm mb-4">Development milestones and timeline</p>
              <Link className="btn-soft" href={withBase("/roadmap")}>View Roadmap</Link>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2">Live Data</h3>
              <p className="text-muted text-sm mb-4">Real-time on-chain metrics and analytics</p>
              <Link className="btn-soft" href={withBase("/institutions")}>View Data</Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}