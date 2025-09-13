"use client"
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import { BulletList } from '@/components/ui/BulletList'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function WhitepaperPage() {
  const { mode, pageCopy } = useCopy('whitepaper')
  return (
    <PageTheme ink="dark" lift="none" glass="standard">
      <BackgroundPhoto variant="whitepaper" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <ModeTextSwap as="h1" depKey={`wp-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[mode]} />
              <ModeTextSwap as="p" depKey={`wp-hero-sub-${mode}`} className="text-xl text-muted max-w-3xl mx-auto" content={pageCopy.heroSub[mode]} />
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <ModeTextSwap as="h2" depKey={`wp-p0-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[0]?.title[mode] || 'Design Goals'} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Transparency</h3>
                    <p className="text-muted">{pageCopy.pillars?.[0]?.body[mode] || 'Every material statement about MXTK maps to a verifiable source.'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Compliance</h3>
                    <p className="text-muted">{pageCopy.pillars?.[1]?.body[mode] || 'Built for regulated markets with proper KYC/AML, custody, and reporting frameworks.'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Liquidity</h3>
                    <p className="text-muted">{pageCopy.pillars?.[2]?.body[mode] || 'Deep, stable markets through multiple venue support and institutional-grade infrastructure.'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Governance</h3>
                    <p className="text-muted">Change controls, multisig approvals, and transparent change logs.</p>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6">Token Foundation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Documentation</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'JORC/NI43-101/SKR reports' },
                        { title: 'Chain-of-title verification' },
                        { title: 'Technical assessments' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Verification</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Independent review' },
                        { title: 'Third-party validation' },
                        { title: 'Expert assessments' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Tokenization</h3>
                    <BulletList 
                      centered={true}
                      items={[
                        { title: 'Legal structure' },
                        { title: 'Custody solutions' },
                        { title: 'On-chain representation' },
                      ]} 
                    />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Oracle Governance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Methodology</h3>
                    <BulletList 
                      items={[
                        { title: 'Transparent algorithms' },
                        { title: 'Multi-source aggregation' },
                        { title: 'Periodic review' },
                        { title: 'Community input' },
                      ]} 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Governance</h3>
                    <BulletList 
                      items={[
                        { title: 'Timelock upgrades' },
                        { title: 'Multi-sig controls' },
                        { title: 'Emergency pause' },
                        { title: 'Change logs' },
                      ]} 
                    />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={4}>
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
            </SectionWrapper>

            {pageCopy.sections?.map((sec, idx) => (
              <SectionWrapper key={`${idx}-${mode}`} index={5 + idx}>
                <Card tint={idx % 2 === 0 ? "amber" : "navy"}>
                  <ModeTextSwap
                    as="h2"
                    depKey={`wp-sec-${idx}-heading-${mode}`}
                    className="text-xl md:text-2xl font-semibold mb-6"
                    content={sec.heading[mode]}
                  />
                  <div className="space-y-4">
                    {sec.paragraphs[mode].map((p, i) => (
                      <ModeTextSwap
                        key={i}
                        as="p"
                        depKey={`wp-sec-${idx}-p-${i}-${mode}`}
                        className="leading-relaxed text-muted"
                        content={p}
                      />
                    ))}
                  </div>
                  {sec.highlight?.[mode] ? (
                    <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                      <ModeTextSwap
                        as="div"
                        depKey={`wp-sec-${idx}-hl-${mode}`}
                        className="text-sm opacity-90"
                        content={sec.highlight[mode]}
                      />
                    </div>
                  ) : null}
                </Card>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}