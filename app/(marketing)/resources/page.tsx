"use client"
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import { BulletList } from '@/components/ui/BulletList'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
import Link from 'next/link'

export default function Resources() {
  const { mode, pageCopy } = useCopy('resources')
  const contentMode = (mode === 'ai') ? 'build' : mode;
  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <BackgroundPhoto variant="resources" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <ModeTextSwap as="h1" depKey={`resources-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[contentMode]} />
              <ModeTextSwap as="p" depKey={`resources-hero-sub-${mode}`} className="text-xl text-muted max-w-3xl mx-auto" content={pageCopy.heroSub[contentMode]} />
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-8">
            {/* Article 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm" style={{color:'var(--ink-muted)'}}>
                <span>Bo Vargas</span>
                <span>•</span>
                <span>5/7/25</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                How Traders Can Leverage Mineral Token (MXTK) to Navigate Global Market Turbulence
              </h3>
              <p className="text-foreground/80 text-sm">
                How Mineral Owners Can Unlock the Full Financial Potential of Their Assets with Mineral Token
              </p>
              <Link href="#" className="btn-link text-sm">
                Read More →
              </Link>
            </div>

            {/* Article 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm" style={{color:'var(--ink-muted)'}}>
                <span>Todd Davison</span>
                <span>•</span>
                <span>4/21/25</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                How Mineral Owners Can Unlock the Full Financial Potential of Their Assets with Mineral Token
              </h3>
              <p className="text-foreground/80 text-sm">
                How Mineral Owners Can Unlock the Full Financial Potential of Their Assets with Mineral Token
              </p>
              <Link href="#" className="btn-link text-sm">
                Read More →
              </Link>
            </div>

            {/* Article 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm" style={{color:'var(--ink-muted)'}}>
                <span>Todd Davison</span>
                <span>•</span>
                <span>4/21/25</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Mineral Token and the Future of Financial Engineering: A New Class of Asset-Backed Security
              </h3>
              <p className="text-foreground/80 text-sm">
                Mineral Token and the Future of Financial Engineering: A New Class of Asset-Backed Security.
              </p>
              <Link href="#" className="btn-link text-sm">
                Read More →
              </Link>
            </div>

            {/* Article 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm" style={{color:'var(--ink-muted)'}}>
                <span>Todd Davison</span>
                <span>•</span>
                <span>6/19/24</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                How Tokenization is Reshaping the Financial Landscape: Insights from Mineral Token (MXTK)
              </h3>
              <p className="text-foreground/80 text-sm">
                Why Tokenization Will Dominate the Financial Sector in 2024
              </p>
              <Link href="#" className="btn-link text-sm">
                Read More →
              </Link>
            </div>

            {/* Article 5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>Bo Vargas</span>
                <span>•</span>
                <span>4/5/24</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Message from Bo Vargas to friends and family
              </h3>
              <p className="text-foreground/80 text-sm">
                A personal message from our founder about the vision and mission of Mineral Token.
              </p>
              <Link href="#" className="btn-link text-sm">
                Read More →
              </Link>
            </div>
                </div>
                <div className="mt-8 pt-6 border-t border-border">
                  <Link href="#" className="btn-soft">View Older Posts</Link>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Educational Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Whitepaper</h3>
                    <p className="text-muted text-sm mb-4">Technical documentation and tokenomics</p>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Technical specs' },
                        { title: 'Tokenomics model' },
                        { title: 'Architecture details' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Transparency Hub</h3>
                    <p className="text-muted text-sm mb-4">Live data, logs, OTC aggregates</p>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Real-time data' },
                        { title: 'Oracle logs' },
                        { title: 'OTC aggregates' },
                      ]} 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Ecosystem</h3>
                    <p className="text-muted text-sm mb-4">Partners, integrations, infrastructure</p>
                    <BulletList 
                      centered={true}
                      showDescription={false}
                      items={[
                        { title: 'Strategic partners' },
                        { title: 'Key integrations' },
                        { title: 'Infrastructure' },
                      ]} 
                    />
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6 text-center">Trading Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">U</span>
                    </div>
                    <h3 className="font-semibold mb-2">Uniswap (Arbitrum)</h3>
                    <p className="text-sm text-muted">Primary DEX for MXTK</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">CG</span>
                    </div>
                    <h3 className="font-semibold mb-2">CoinGecko</h3>
                    <p className="text-sm text-muted">Price tracking and metadata</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <h3 className="font-semibold mb-2">Arbiscan</h3>
                    <p className="text-sm text-muted">Token details and holders</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">📱</span>
                    </div>
                    <h3 className="font-semibold mb-2">Setup Guides</h3>
                    <p className="text-sm text-muted">MetaMask, Bitget, Arbitrum network</p>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={4}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">Stay Connected</h2>
                <p className="text-foreground/80 mb-6">For the latest updates, research, and insights about Mineral Token, follow us on social media and subscribe to our newsletter.</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:info@mineral-token.com" className="text-accent hover:underline">info@mineral-token.com</a></p>
                  <p><strong>Telegram:</strong> <a href="https://t.me/mineraltoken" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@mineraltoken</a></p>
                </div>
              </Card>
            </SectionWrapper>
            {pageCopy.sections?.map((sec, idx) => (
              <SectionWrapper key={`${idx}-${mode}`} index={5 + idx}>
                <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
                  <ModeTextSwap
                    as="h2"
                    depKey={`resources-sec-${idx}-heading-${mode}`}
                    className="text-xl md:text-2xl font-semibold mb-6"
                    content={sec.heading[contentMode]}
                  />
                  <div className="space-y-4">
                    {sec.paragraphs[contentMode].map((p, i) => (
                      <ModeTextSwap
                        key={i}
                        as="p"
                        depKey={`resources-sec-${idx}-p-${i}-${mode}`}
                        className="leading-relaxed text-muted"
                        content={p}
                      />
                    ))}
                  </div>
                  {sec.highlight?.[contentMode] ? (
                    <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                      <ModeTextSwap
                        as="div"
                        depKey={`resources-sec-${idx}-hl-${mode}`}
                        className="text-sm opacity-90"
                        content={sec.highlight[contentMode]}
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
