import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function Resources() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Resources</h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Educational content, research, and insights about Mineral Token and the future of asset-backed securities.
        </p>
      </section>

      {/* Featured Articles */}
      <section className="section-amber">
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
            <Link href="#" className="btn-soft">
              View Older Posts
            </Link>
          </div>
        </Card>
      </section>

      {/* Educational Resources */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Educational Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📚</div>
              <h3 className="font-semibold mb-2 text-foreground">Whitepaper</h3>
              <p className="text-foreground/80 text-sm mb-4">Comprehensive technical documentation and tokenomics</p>
              <Link href="/whitepaper" className="btn-soft">
                Read Whitepaper
              </Link>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2 text-foreground">Transparency Hub</h3>
              <p className="text-foreground/80 text-sm mb-4">Real-time data, oracle logs, and OTC aggregates</p>
              <Link href="/transparency" className="btn-soft">
                View Data
              </Link>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🔗</div>
              <h3 className="font-semibold mb-2 text-foreground">Ecosystem</h3>
              <p className="text-foreground/80 text-sm mb-4">Partners, integrations, and infrastructure</p>
              <Link href="/ecosystem" className="btn-soft">
                Explore Ecosystem
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Trading Resources */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Trading Resources</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Where to Trade MXTK</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://app.uniswap.org/explore/tokens/arbitrum/0x3e4ffeb394b371aaaa0998488046ca19d870d9ba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Uniswap (Arbitrum) - Primary DEX
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.coingecko.com/en/coins/mineral-token" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    CoinGecko - Price Tracking
                  </a>
                </li>
                <li>
                  <a 
                    href="https://arbiscan.io/token/0x3e4ffeb394b371aaaa0998488046ca19d870d9ba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Arbiscan - Blockchain Explorer
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Wallet Setup Guides</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="text-accent hover:underline">
                    MetaMask Setup Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-accent hover:underline">
                    Bitget Exchange Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-accent hover:underline">
                    Arbitrum Network Configuration
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Contact */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Stay Connected</h2>
          <p className="text-foreground/80 mb-6">
            For the latest updates, research, and insights about Mineral Token, follow us on social media and subscribe to our newsletter.
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:info@mineral-token.com" className="text-accent hover:underline">
                info@mineral-token.com
              </a>
            </p>
            <p>
              <strong>Telegram:</strong>{' '}
              <a href="https://t.me/mineraltoken" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @mineraltoken
              </a>
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}
