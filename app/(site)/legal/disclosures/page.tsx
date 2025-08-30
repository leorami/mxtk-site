import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'

export default function DisclosuresPage() {
  return (
    <PageTheme ink="dark" lift="none">
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Disclosures</h1>
          <p className="text-xl max-w-3xl mx-auto">Effective date: …</p>
        </SectionWrapper>

        <SectionWrapper index={1}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Investment Risk Disclosures</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Investing in cryptocurrencies, including Mineral Token (MXTK), involves substantial risk and is not suitable 
              for all investors. Please carefully consider the following risks before investing.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Market Risk</h3>
                <p className="text-sm text-muted">
                  The value of cryptocurrencies can be highly volatile and may fluctuate significantly in response to 
                  market conditions, regulatory changes, and other factors. You may lose some or all of your investment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Regulatory Risk</h3>
                <p className="text-sm text-muted">
                  Cryptocurrency regulations are evolving and vary by jurisdiction. Changes in regulations may adversely 
                  affect the value and liquidity of MXTK.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technology Risk</h3>
                <p className="text-sm text-muted">
                  Blockchain technology is relatively new and may be subject to technical failures, security breaches, 
                  or other operational risks.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Liquidity Risk</h3>
                <p className="text-sm text-muted">
                  Cryptocurrency markets may have limited liquidity, making it difficult to buy or sell large amounts 
                  without significantly affecting the price.
                </p>
              </div>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={2}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Mineral Asset Disclosures</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Mineral Token (MXTK) is backed by mineral assets. The following disclosures apply to these underlying assets.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Geological Risk</h3>
                <p className="text-sm text-muted">
                  Mineral deposits are subject to geological uncertainties. Resource estimates may be revised based on 
                  new exploration data, and actual production may differ from estimates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Commodity Price Risk</h3>
                <p className="text-sm text-muted">
                  The value of mineral assets is directly tied to commodity prices, which are subject to significant 
                  fluctuations based on global supply and demand factors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Operational Risk</h3>
                <p className="text-sm text-muted">
                  Mining operations are subject to various risks including environmental factors, regulatory changes, 
                  labor disputes, and technical challenges.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Environmental and Social Risk</h3>
                <p className="text-sm text-muted">
                  Mining activities may have environmental and social impacts. Compliance with environmental regulations 
                  and social responsibility standards is essential.
                </p>
              </div>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={3}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Regulatory Disclosures</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Mineral Token operates in compliance with applicable laws and regulations. The following regulatory 
              information is provided for transparency.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Securities Law Compliance</h3>
                <p className="text-sm text-muted">
                  MXTK may be considered a security in certain jurisdictions. Investors should consult with legal 
                  and financial advisors regarding the regulatory status of MXTK in their jurisdiction.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">KYC/AML Requirements</h3>
                <p className="text-sm text-muted">
                  Mineral Token complies with Know Your Customer (KYC) and Anti-Money Laundering (AML) requirements. 
                  Investors may be required to provide identification and source of funds documentation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tax Implications</h3>
                <p className="text-sm text-muted">
                  Cryptocurrency transactions may have tax implications. Investors are responsible for understanding 
                  and complying with applicable tax laws in their jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={4}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Technical Disclosures</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Important technical information about the Mineral Token platform and blockchain infrastructure.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Smart Contract Risk</h3>
                <p className="text-sm text-muted">
                  MXTK operates on smart contracts deployed on the Arbitrum blockchain. Smart contracts may contain 
                  bugs or vulnerabilities that could result in loss of funds.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Oracle Risk</h3>
                <p className="text-sm text-muted">
                  Price feeds and other data are provided by oracles. Oracle failures or manipulation could affect 
                  the accuracy of asset valuations and trading operations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Network Risk</h3>
                <p className="text-sm text-muted">
                  The Arbitrum network may experience congestion, delays, or other issues that could affect 
                  transaction processing and user experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wallet Security</h3>
                <p className="text-sm text-muted">
                  Users are responsible for securing their private keys and wallet credentials. Loss of private keys 
                  may result in permanent loss of access to MXTK tokens.
                </p>
              </div>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={5}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Conflict of Interest Disclosures</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Mineral Token and its affiliates may have interests that could potentially conflict with those of investors.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Affiliate Relationships</h3>
                <p className="text-sm text-muted">
                  Mineral Token may have business relationships with mining companies, service providers, and other 
                  entities in the ecosystem. These relationships may create potential conflicts of interest.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Trading Activities</h3>
                <p className="text-sm text-muted">
                  Mineral Token and its affiliates may engage in trading activities involving MXTK or related assets. 
                  These activities may affect market prices and liquidity.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fee Structure</h3>
                <p className="text-sm text-muted">
                  Mineral Token may earn fees from various activities including trading, custody, and advisory services. 
                  These fees may create incentives that differ from investor interests.
                </p>
              </div>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={6}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Forward-Looking Statements</h2>
          <div className="space-y-4">
            <p className="text-muted">
              This website may contain forward-looking statements about Mineral Token's future plans, objectives, 
              and expectations. These statements are subject to various risks and uncertainties.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Statement Nature</h3>
                <p className="text-sm text-muted">
                  Forward-looking statements are based on current expectations and assumptions that may not prove to be accurate. 
                  Actual results may differ materially from those expressed or implied in such statements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk Factors</h3>
                <p className="text-sm text-muted">
                  Factors that could cause actual results to differ include market conditions, regulatory changes, 
                  technological developments, and other factors beyond our control.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Guarantee</h3>
                <p className="text-sm text-muted">
                  Mineral Token does not guarantee that any forward-looking statements will be realized. 
                  Investors should not rely solely on forward-looking statements when making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={7}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Additional Information</h2>
          <p className="text-muted mb-4">
            For additional information about these disclosures or to request clarification, please contact us:
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@mineral-token.com" className="text-accent hover:underline">
                legal@mineral-token.com
              </a>
            </p>
            <p>
              <strong>General Contact:</strong>{' '}
              <a href="mailto:info@mineral-token.com" className="text-accent hover:underline">
                info@mineral-token.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> Mineral Token Legal Department
            </p>
          </div>
          <p className="text-sm text-muted mt-4">
            <strong>Last Updated:</strong> January 2025
          </p>
        </Card>
        </SectionWrapper>
      </PageHero>
    </PageTheme>
  )
}