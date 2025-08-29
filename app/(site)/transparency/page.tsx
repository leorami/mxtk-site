'use client'

import PageHero from '@/components/PageHero'
import ProofTable from '@/components/ProofTable'
import SectionWrapper from '@/components/SectionWrapper'
import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
import { PLACEHOLDER_PROOFS } from '@/lib/placeholders'
import { getRelativePath } from '@/lib/routing/basePath'
import Link from 'next/link'
import { usePublicPath } from '@/lib/routing/getPublicPathClient'
import { usePathname } from 'next/navigation'

export default function TransparencyPage() {
  const pathname = usePathname() || '/'
  return (
    <>
      <BackgroundPhoto variant="transparency" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Trust & Transparency
              </h1>
              <div className="flex justify-center items-center gap-4 mt-4">
                <img src={usePublicPath('icons/mineral/icon-lattice.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
                <img src={usePublicPath('icons/mineral/icon-sparkle.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
                <img src={usePublicPath('icons/mineral/icon-bands.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
              </div>
              <p className="text-xl max-w-3xl mx-auto">
                Every material statement about MXTK should map to a source: a file, an address, or a method. Until a claim is evidenced, it stays clearly labeled as preview.
              </p>
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
                <OnchainSummary />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
                <PoolTable />
              </Card>
            </SectionWrapper>

            <div className="container mx-auto px-4 py-10 md:py-12">
              <FeatureRow
                cols={3}
                items={[
                  { title: 'Independent verification', body: 'Third-party validation and lab analysis.' },
                  { title: 'Method transparency', body: 'Documented, reviewable oracle methodology.' },
                  { title: 'Traceable claims', body: 'Every statement maps to evidence.' },
                ]}
              />
            </div>

            <SectionWrapper index={4}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Attestations & Audits</h2>
                <ProofTable proofs={PLACEHOLDER_PROOFS} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={5}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
              </Card>
            </SectionWrapper>

            {/* Decorative organic band removed; background handled by BackgroundPhoto */}
          </div>
        </div>
      </PageHero>
    </>
  )
}