'use client'

import PageHero from '@/components/PageHero'
import ProofTable from '@/components/ProofTable'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import PhotoBackdrop from '@/components/visuals/PhotoBackdrop'
import { PLACEHOLDER_PROOFS } from '@/lib/placeholders'
import { getRelativePath } from '@/lib/routing/basePath'

import AppImage from '@/components/ui/AppImage'
import { getPublicPath } from '@/lib/routing/basePath'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TransparencyPage() {
  const pathname = usePathname() || '/'
  const { mode, pageCopy } = useCopy('transparency')
  return (
    <PageTheme ink="dark" lift="M" glass="soft">
      <PhotoBackdrop src="art/photos/transparency_tigereye.jpg" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Trust & Transparency
              </h1>
              <div className="flex justify-center items-center gap-4 mt-4">
                <AppImage src={getPublicPath('icons/mineral/icon-lattice.svg', pathname)} alt="" width={24} height={24} role="presentation" aria-hidden className="w-6 h-6 opacity-70" />
                <AppImage src={getPublicPath('icons/mineral/icon-sparkle.svg', pathname)} alt="" width={24} height={24} role="presentation" aria-hidden className="w-6 h-6 opacity-70" />
                <AppImage src={getPublicPath('icons/mineral/icon-bands.svg', pathname)} alt="" width={24} height={24} role="presentation" aria-hidden className="w-6 h-6 opacity-70" />
              </div>
              <p className="text-xl max-w-3xl mx-auto">
                Every material statement about MXTK should map to a source: a file, an address, or a method. Until a claim is evidenced, it stays clearly labeled as preview.
              </p>
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <ModeTextSwap as="h2" depKey={`tp-p0-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[0]?.title[mode] || 'Token Information'} />
                <OnchainSummary />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="teal">
                <ModeTextSwap as="h2" depKey={`tp-p1-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[1]?.title[mode] || 'Liquidity & On-chain Addresses'} />
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
                <ModeTextSwap as="h2" depKey={`tp-p2-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[2]?.title[mode] || 'Attestations & Audits'} />
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

            {pageCopy.sections?.map((sec, idx) => (
              <section key={`${idx}-${mode}`} className="mt-10">
                <div className="glass glass--panel p-6 md:p-8 rounded-xl">
                  <ModeTextSwap
                    as="h2"
                    depKey={`tp-sec-${idx}-heading-${mode}`}
                    className="text-xl md:text-2xl font-semibold h-on-gradient"
                    content={sec.heading[mode]}
                  />
                  <div className="mt-4 space-y-4 sub-on-gradient">
                    {sec.paragraphs[mode].map((p, i) => (
                      <ModeTextSwap
                        key={i}
                        as="p"
                        depKey={`tp-sec-${idx}-p-${i}-${mode}`}
                        className="leading-relaxed"
                        content={p}
                      />
                    ))}
                  </div>
                  {sec.highlight?.[mode] ? (
                    <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                      <ModeTextSwap
                        as="div"
                        depKey={`tp-sec-${idx}-hl-${mode}`}
                        className="text-sm opacity-90"
                        content={sec.highlight[mode]}
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            ))}

            {/* Decorative organic band removed; background handled by BackgroundPhoto */}
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}