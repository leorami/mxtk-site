import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'
import { BulletItem, BulletList } from '@/components/ui/List'

export default function FAQ() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">FAQ</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Learn more about how to set-up and access Mineral Token.
          </p>
        </section>
      </PageHero>

      {/* How to find MXTK */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">How to find MXTK</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Exchange</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://app.uniswap.org/explore/tokens/arbitrum/0x3e4ffeb394b371aaaa0998488046ca19d870d9ba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Uniswap (Arbitrum)
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.coingecko.com/en/coins/mineral-token" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    CoinGecko
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Blockchain Explorer</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://arbiscan.io/token/0x3e4ffeb394b371aaaa0998488046ca19d870d9ba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Arbiscan
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* How to Guides */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">How to Guides</h2>
          
          {/* Bitget Setup */}
          <div className="space-y-6 mb-12">
            <h3 className="text-xl font-semibold">Setting up a wallet in Bitget</h3>
            <p className="text-muted mb-4">
              Setting up a wallet in Bitget involves creating an account, securing it with two-factor authentication (2FA), and generating wallet addresses for different cryptocurrencies.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Step 1: Create a Bitget Account</h4>
                <BulletList>
                  <BulletItem title="Visit the official Bitget website" />
                  <BulletItem title="Click on the 'Sign Up' button" />
                  <BulletItem title="Choose your country and enter your email address or phone number" />
                  <BulletItem title="Create a strong password and agree to the Terms of Service" />
                  <BulletItem title="Complete email/phone verification" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 2: Secure Your Account with 2FA</h4>
                <BulletList>
                  <BulletItem title="Log in to your account" />
                  <BulletItem title="Go to account settings and navigate to 'Security'" />
                  <BulletItem title="Select 'Two-Factor Authentication'" />
                  <BulletItem title="Download an authenticator app (Google Authenticator, Authy, etc.)" />
                  <BulletItem title="Scan the QR code and enter the 6-digit verification code" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 3: Generate Wallet Addresses</h4>
                <BulletList>
                  <BulletItem title={'Navigate to the "Wallet" section'} />
                  <BulletItem title="Select the cryptocurrency for which you want to generate a wallet address" />
                  <BulletItem title={'Click on the "Deposit" button'} />
                  <BulletItem title="Copy the generated wallet address" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 4: Start Trading</h4>
                <BulletList>
                  <BulletItem title="Deposit funds using the wallet address" />
                  <BulletItem title={'Navigate to the "Trade" section'} />
                  <BulletItem title="Transfer funds to your trading account if necessary" />
                  <BulletItem title="Begin trading MXTK and other cryptocurrencies" />
                </BulletList>
              </div>
            </div>
          </div>

          {/* MetaMask Setup */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Setting up a wallet in MetaMask</h3>
            <p className="text-muted mb-4">
              Setting up a wallet in MetaMask involves creating an account, securing it with a seed phrase, and connecting to different blockchain networks.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Step 1: Install MetaMask</h4>
                <BulletList>
                  <BulletItem title="Go to the MetaMask website and click 'Download'" />
                  <BulletItem title="Choose the appropriate version for your browser" />
                  <BulletItem title="Follow the prompts to add the MetaMask extension" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 2: Create a New Wallet</h4>
                <BulletList>
                  <BulletItem title="Click on the MetaMask icon in your browser toolbar" />
                  <BulletItem title="Choose 'Create a Wallet'" />
                  <BulletItem title="Set a strong password for your MetaMask wallet" />
                  <BulletItem title="Agree to the Terms of Use and click 'Create'" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 3: Secure Your Wallet</h4>
                <BulletList>
                  <BulletItem title="Write down your 12-word secret backup phrase on paper" />
                  <BulletItem title="Store it in a secure place - do not save it digitally" />
                  <BulletItem title="Confirm your seed phrase by selecting the words in order" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 4: Add Arbitrum Network</h4>
                <BulletList>
                  <BulletItem title="Click on the network dropdown at the top of MetaMask" />
                  <BulletItem title="Select 'Add Network' or 'Custom RPC'" />
                  <BulletItem title="Add Arbitrum One with these details:" />
                  <BulletItem title="Network Name: Arbitrum One" />
                  <BulletItem title="RPC URL: https://arb1.arbitrum.io/rpc" />
                  <BulletItem title="Chain ID: 42161" />
                  <BulletItem title="Currency Symbol: ETH" />
                </BulletList>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 5: Connect to DApps</h4>
                <BulletList>
                  <BulletItem title="Navigate to Uniswap or other DApps" />
                  <BulletItem title="MetaMask will prompt you to connect your wallet" />
                  <BulletItem title="Authorize the connection to begin trading" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Contact */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Need Help?</h2>
          <p className="text-muted mb-4">
            If you need assistance with setting up your wallet or have questions about MXTK, please reach out to us:
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
