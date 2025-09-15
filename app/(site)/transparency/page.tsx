// Server component: fetch data server-side to avoid drift

import PageHero from '@/components/PageHero'
import ProofTable from '@/components/ProofTable'
import SectionWrapper from '@/components/SectionWrapper'
import TimeSeries from '@/components/charts/TimeSeries'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import OnchainSummary from '@/components/live/OnchainSummary'
import PageTheme from '@/components/theme/PageTheme'
import { BulletList } from '@/components/ui/BulletList'
import Card from '@/components/ui/Card'
import DataTableGlass from '@/components/ui/DataTableGlass'
import PhotoBackdrop from '@/components/visuals/PhotoBackdrop'
import { transparencyCopy } from '@/copy/transparency'
import { getBasePathUrl } from '@/lib/basepath'
import { env } from '@/lib/env'
import { PLACEHOLDER_PROOFS } from '@/lib/placeholders'
import { getRelativePath } from '@/lib/routing/basePath'
import { headers } from 'next/headers'

import AppImage from '@/components/ui/AppImage'
import Link from 'next/link'

export default async function TransparencyPage() {
  const pathname = ''
  const mode = 'build'
  const pageCopy = transparencyCopy
  // Server fetch for pools
  const token = (process.env.MXTK_TOKEN || env.MXTK_TOKEN_ADDRESS)
  const apiPath = getBasePathUrl(`/api/data/pools?token=${encodeURIComponent(token)}`)
  const absUrl = await absoluteUrlFromHeaders(apiPath)
  const res = await fetch(absUrl, { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
  const json = await res.json().catch(() => ({ updatedAt: Date.now(), ttl: 0, data: [] }))
  const rows = json.data || []
  const updatedAt = Number(json.updatedAt) || Date.now()
  const ttl = Number(json.ttl) || 0
  return (
    <PageTheme ink="warm" lift="none" glass="standard">
      <PhotoBackdrop src="art/photos/transparency_tigereye.jpg" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Trust & Transparency
              </h1>
              <div className="flex justify-center items-center gap-4 mt-4">
                <AppImage src="icons/mineral/icon-lattice.svg" alt="" width={24} height={24} role="presentation" aria-hidden className="w-6 h-6 opacity-70" />
                <AppImage src="icons/mineral/icon-sparkle.svg" alt="" width={24} height={24} role="presentation" aria-hidden className="w-6 h-6 opacity-70" />
                <AppImage src="icons/mineral/icon-bands.svg" alt="" width={24} height={24} role="presentation" aria-hidden className="w-6 h-6 opacity-70" />
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
                <div className="flex items-center justify-between mb-6">
                  <ModeTextSwap as="h2" depKey={`tp-p1-title-${mode}`} className="text-2xl font-semibold" content={pageCopy.pillars?.[1]?.title[mode] || 'Liquidity & On-chain Addresses'} />
                </div>
                <div className="relative">
                  <DataTableGlass rows={rows} updatedAt={updatedAt} ttl={ttl} stackedMobile />
                  <div className="absolute right-2 top-2 opacity-0 pointer-events-none [html.guide-open_&]:opacity-100 transition-opacity">
                    <form action={getBasePathUrl('/api/ai/home/pin')} method="post">
                      <input type="hidden" name="id" value="default" />
                      <input type="hidden" name="widget[type]" value="pools-table" />
                      <input type="hidden" name="widget[data][token]" value={token} />
                      <input type="hidden" name="widget[size][w]" value="6" />
                      <input type="hidden" name="widget[size][h]" value="24" />
                      <button type="submit" className="btn-ghost text-xs">Pin to Home</button>
                    </form>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6 text-center">Verification Standards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Independent verification</h3>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Third-party validation' },
                        { title: 'Lab analysis' },
                        { title: 'External audits' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Method transparency</h3>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Documented processes' },
                        { title: 'Reviewable methodology' },
                        { title: 'Open algorithms' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Traceable claims</h3>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Evidence mapping' },
                        { title: 'Source verification' },
                        { title: 'Chain of custody' },
                      ]} 
                    />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={4}>
              <Card tint="navy">
                <ModeTextSwap as="h2" depKey={`tp-p2-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[2]?.title[mode] || 'Attestations & Audits'} />
                <ProofTable proofs={PLACEHOLDER_PROOFS} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={5}>
              <Card tint="amber">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Price (MXTK)</h2>
                  <form action={getBasePathUrl('/api/ai/home/pin')} method="post" className="opacity-0 pointer-events-none [html.guide-open_&]:opacity-100 [html.guide-open_&]:pointer-events-auto transition-opacity">
                    <input type="hidden" name="id" value="default" />
                    <input type="hidden" name="widget[type]" value="price-large" />
                    <input type="hidden" name="widget[data][symbol]" value="MXTK" />
                    <input type="hidden" name="widget[data][interval]" value="7d" />
                    <input type="hidden" name="widget[size][w]" value="6" />
                    <input type="hidden" name="widget[size][h]" value="24" />
                    <button type="submit" className="btn-ghost text-xs">Pin to Home</button>
                  </form>
                </div>
                {/* SSR-safe chart */}
                <TimeSeries symbol="MXTK" />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={6}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Whitepaper</h3>
                    <p className="text-muted text-sm mb-4">Technical documentation and methodology</p>
                    <Link className="btn-soft" href={getRelativePath('whitepaper', pathname)} suppressHydrationWarning>Read Whitepaper</Link>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                        <path d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.28,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.72,21L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Roadmap</h3>
                    <p className="text-muted text-sm mb-4">Development milestones and timeline</p>
                    <Link className="btn-soft" href={getRelativePath('roadmap', pathname)} suppressHydrationWarning>View Roadmap</Link>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                        <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Live Data</h3>
                    <p className="text-muted text-sm mb-4">Real-time on-chain metrics and analytics</p>
                    <Link className="btn-soft" href={getRelativePath('institutions', pathname)} suppressHydrationWarning>View Data</Link>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            {pageCopy.sections?.map((sec, idx) => (
              <SectionWrapper key={`${idx}-${mode}`} index={6 + idx}>
                <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
                  <ModeTextSwap
                    as="h2"
                    depKey={`tp-sec-${idx}-heading-${mode}`}
                    className="text-xl md:text-2xl font-semibold mb-6"
                    content={sec.heading[mode]}
                  />
                  <div className="space-y-4">
                    {sec.paragraphs[mode].map((p, i) => (
                      <ModeTextSwap
                        key={i}
                        as="p"
                        depKey={`tp-sec-${idx}-p-${i}-${mode}`}
                        className="leading-relaxed text-muted"
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
                </Card>
              </SectionWrapper>
            ))}

            {/* Decorative organic band removed; background handled by BackgroundPhoto */}
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}

async function absoluteUrlFromHeaders(path: string): Promise<string> {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:2000'
  const proto = h.get('x-forwarded-proto') || 'http'
  const origin = `${proto}://${host}`
  return new URL(path, origin).toString()
}

function badge(updatedAt: number, ttl: number): { kind: 'live'|'stale'; label: string } {
  const now = Date.now()
  const ageMs = Math.max(0, now - (updatedAt || now))
  if (ageMs < 60_000) return { kind: 'live', label: 'live' }
  const mm = Math.floor(ageMs / 60000)
  const ss = Math.floor((ageMs % 60000) / 1000)
  return { kind: 'stale', label: `stale (${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')})` }
}