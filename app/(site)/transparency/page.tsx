'use client'

import PageHero from '@/components/PageHero'
import ProofTable from '@/components/ProofTable'
import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import Card from '@/components/ui/Card'
import { PLACEHOLDER_PROOFS } from '@/lib/placeholders'
import { getPublicPath, getRelativePath } from '@/lib/routing/basePath'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TransparencyPage() {
  const pathname = usePathname() || '/'
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-950 dark:text-gray-50">
            Trust & Transparency
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <img src={getPublicPath('icons/mineral/icon-lattice.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-sparkle.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-bands.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
            Every material statement about MXTK should map to a source: a file, an address, or a method. Until a claim is evidenced, it stays clearly labeled as preview.
          </p>
        </section>
      </PageHero>

      {/* Token Information */}
      <section className="glass">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
          <OnchainSummary />
          
          {/* Token data supporting image - temporarily removed for cleaner look */}
          {/* <img src={getPublicPath('minerals/supporting/transparency_support_veins.jpg', pathname)} alt="Tiger's eye veins" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
        </Card>
      </section>

      {/* Liquidity Pools */}
      <section className="glass">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
          <PoolTable />
        </Card>
      </section>

      {/* Independent Verification */}
      <section className="glass">
        <Card tint="navy">
          <div>
            <h3 className="font-semibold mb-3 text-lg">Independent Verification</h3>
            <p className="text-muted mb-4">
              Our transparency framework relies on independent verification and testing to ensure accurate mineral valuations. Every claim is backed by rigorous laboratory analysis and third-party validation.
            </p>
            <p className="text-muted text-sm">
              This commitment to independent verification ensures that all MXTK token holders can trust the underlying asset valuations and reporting standards.
            </p>
          </div>
        </Card>
      </section>

      {/* Attestations & Audits */}
      <section className="glass">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Attestations & Audits</h2>
          <ProofTable proofs={PLACEHOLDER_PROOFS} />
        </Card>
      </section>

      {/* Additional Resources */}
      <section className="glass">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📄</div>
              <h3 className="font-semibold mb-2">Whitepaper</h3>
              <p className="text-muted text-sm mb-4">Technical documentation and methodology</p>
              <Link className="btn-soft" href={getRelativePath('whitepaper', pathname)} suppressHydrationWarning>Read Whitepaper</Link>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🗺️</div>
              <h3 className="font-semibold mb-2">Roadmap</h3>
              <p className="text-muted text-sm mb-4">Development milestones and timeline</p>
              <Link className="btn-soft" href={getRelativePath('roadmap', pathname)} suppressHydrationWarning>View Roadmap</Link>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2">Live Data</h3>
              <p className="text-muted text-sm mb-4">Real-time on-chain metrics and analytics</p>
              <Link className="btn-soft" href={getRelativePath('institutions', pathname)} suppressHydrationWarning>View Data</Link>
            </div>
          </div>
          
          {/* Lab/attestations supporting image - temporarily removed for cleaner look */}
          {/* <img src={getPublicPath('minerals/supporting/transparency_support_cells.jpg', pathname)} alt="Tiger's eye cells" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
        </Card>
      </section>
    </div>
  )
}