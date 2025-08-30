import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
import Link from 'next/link'

export default function Resources() {
  return (
    <PageTheme ink="warm" lift="M">
      <BackgroundPhoto variant="resources" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">Resources</h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Educational content, research, and insights about Mineral Token and the future of asset-backed securities.
              </p>
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-8">
            {/* Article 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted">
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
              <div className="flex items-center gap-2 text-sm text-muted">
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
              <div className="flex items-center gap-2 text-sm text-muted">
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
              <div className="flex items-center gap-2 text-sm text-muted">
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
                <FeatureRow cols={3} items={[
                  { title: 'Whitepaper', body: 'Technical documentation and tokenomics.' },
                  { title: 'Transparency hub', body: 'Live data, logs, OTC aggregates.' },
                  { title: 'Ecosystem', body: 'Partners, integrations, infra.' },
                ]} />
              </Card>
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6">Trading Resources</h2>
                <div className="grid md:grid-cols-2 gap-8">
            <FeatureRow cols={2} items={[
              { title: 'Uniswap (Arbitrum)', body: 'Primary DEX for MXTK' },
              { title: 'CoinGecko', body: 'Price tracking and metadata' },
              { title: 'Arbiscan', body: 'Token details and holders' },
              { title: 'Setup guides', body: 'MetaMask, Bitget, Arbitrum network' },
            ]} />
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
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}
