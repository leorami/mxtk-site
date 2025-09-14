// Server component: data wired from APIs
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import TimeSeries from "@/components/charts/TimeSeries";
import ModeTextSwap from "@/components/experience/ModeTextSwap";
import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/components/seo/faq";
import PageTheme from "@/components/theme/PageTheme";
import Card from "@/components/ui/Card";
import DataTableGlass from "@/components/ui/DataTableGlass";
import { FeatureRow } from "@/components/ui/List";
import PhotoBackdrop from "@/components/visuals/PhotoBackdrop";
import { institutionsCopy } from "@/copy/institutions";
import { getBasePathUrl } from '@/lib/basepath';
import { env } from '@/lib/env';
import { headers } from 'next/headers';

export default async function InstitutionsPage() {
  const mode = 'build'
  const pageCopy = institutionsCopy as any
  const token = (process.env.MXTK_TOKEN || env.MXTK_TOKEN_ADDRESS)
  const poolsPath = getBasePathUrl(`/api/data/pools?token=${encodeURIComponent(token)}`)
  const absUrl = await absoluteUrlFromHeaders(poolsPath)
  const res = await fetch(absUrl, { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
  const data = await res.json().catch(() => ({ updatedAt: Date.now(), ttl: 0, data: [] }))
  const updatedAt = Number(data.updatedAt) || Date.now()
  const ttl = Number(data.ttl) || 0
  const faq = faqJsonLd(
    '/institutions',
    [
      { q: 'What does MXTK offer institutions?', a: 'Institution-grade settlement, custody, and transparent attestations.' },
      { q: 'Where can I view token data?', a: 'On the Transparency hub and on-chain summaries.' },
      { q: 'How is risk managed?', a: 'Qualified custody, oracle safeguards, insurance, and transparent change logs.' }
    ]
  );

  return (
    <PageTheme ink="warm" lift="none" glass="standard">
      <JsonLd data={faq} />
      <PhotoBackdrop src="art/photos/institutions_lapis.jpg" />
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <ModeTextSwap
            as="h1"
            depKey={`institutions-hero-title-${mode}`}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            content={pageCopy.heroTitle[mode === 'ai' ? 'build' : mode]}
          />
          <ModeTextSwap
            as="p"
            depKey={`institutions-hero-sub-${mode}`}
            className="text-xl max-w-3xl mx-auto"
            content={pageCopy.heroSub[mode === 'ai' ? 'build' : mode]}
          />
        </SectionWrapper>

        <SectionWrapper index={1}>
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
            <TimeSeries symbol="MXTK" />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={2}>
          <Card tint="teal">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Liquidity & On-chain Addresses</h2>
            </div>
            <div className="relative">
              <DataTableGlass rows={data.data || []} updatedAt={updatedAt} ttl={ttl} />
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
          <Card tint="navy">
            <h2 className="text-2xl font-semibold mb-6">Infrastructure & Security</h2>
            <FeatureRow
              cols={3}
              items={[
                { title: "Token (Arbitrum)", body: "0x3e4F...d9Ba" },
                { title: "Uniswap v4 pool", body: "Coming soon" },
                { title: "LP locker", body: "Coming soon" },
                { title: "Multisig governance", body: "3-of-5" },
                { title: "Timelock", body: "48-hour delay" },
                { title: "Change logs", body: "Transparent upgrades" },
              ]}
            />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={4}>
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">Trading Features</h2>
            <FeatureRow
              cols={3}
              items={[
                { title: "DEX trading", body: "Uniswap v4, concentrated liquidity" },
                { title: "OTC markets", body: "Institutional-grade settlement" },
                { title: "Price feeds", body: "Transparent oracle methodology" },
              ]}
            />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={5}>
          <Card tint="teal">
            <h2 className="text-2xl font-semibold mb-6">Compliance & Custody</h2>
            <FeatureRow
              cols={3}
              items={[
                { title: "KYC/AML compliance" },
                { title: "Qualified custody" },
                { title: "Regulatory reporting" },
                { title: "Insurance coverage" },
                { title: "Audit trails" },
                { title: "Settlement automation" },
              ]}
            />
          </Card>
        </SectionWrapper>

        {/* Mode-aware pillars section */}
        <SectionWrapper index={6}>
          <Card tint="navy">
            <div className="grid md:grid-cols-3 gap-6">
              {pageCopy.pillars?.map((pillar, idx) => (
                <div key={idx} className="glass glass--panel p-6">
                  <ModeTextSwap
                    as="h3"
                    depKey={`institutions-pillar-${idx}-title-${mode}`}
                    className="text-ink font-semibold mb-3"
                    content={pillar.title[mode === 'ai' ? 'build' : mode]}
                  />
                  <ModeTextSwap
                    as="p"
                    depKey={`institutions-pillar-${idx}-body-${mode}`}
                    className="text-ink-subtle"
                    content={pillar.body[mode === 'ai' ? 'build' : mode]}
                  />
                </div>
              ))}
            </div>
          </Card>
        </SectionWrapper>

        {/* Mode-aware sections */}
        {pageCopy.sections?.map((section, idx) => (
          <SectionWrapper key={`section-${idx}-${mode}`} index={7 + idx}>
            <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
              <ModeTextSwap
                as="h2"
                depKey={`institutions-section-${idx}-heading-${mode}`}
                className="text-2xl font-semibold mb-6"
                content={section.heading[mode === 'ai' ? 'build' : mode]}
              />
              <div className="space-y-4">
                {section.paragraphs[mode === 'ai' ? 'build' : mode].map((paragraph, pIdx) => (
                  <ModeTextSwap
                    key={pIdx}
                    as="p"
                    depKey={`institutions-section-${idx}-p-${pIdx}-${mode}`}
                    className="text-muted leading-relaxed"
                    content={paragraph}
                  />
                ))}
              </div>
              {section.highlight?.[mode === 'ai' ? 'build' : mode] && (
                <div className="mt-6 p-4 rounded-lg bg-black/10 dark:bg-white/10">
                  <ModeTextSwap
                    as="p"
                    depKey={`institutions-section-${idx}-highlight-${mode}`}
                    className="text-sm font-medium"
                    content={section.highlight[mode === 'ai' ? 'build' : mode]}
                  />
                </div>
              )}
            </Card>
          </SectionWrapper>
        ))}
      </PageHero>
    </PageTheme>
  );
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