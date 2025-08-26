import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'

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
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Visit the official Bitget website</li>
                  <li>Click on the "Sign Up" button</li>
                  <li>Choose your country and enter your email address or phone number</li>
                  <li>Create a strong password and agree to the Terms of Service</li>
                  <li>Complete email/phone verification</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 2: Secure Your Account with 2FA</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Log in to your account</li>
                  <li>Go to account settings and navigate to "Security"</li>
                  <li>Select "Two-Factor Authentication"</li>
                  <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                  <li>Scan the QR code and enter the 6-digit verification code</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 3: Generate Wallet Addresses</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Navigate to the "Wallet" section</li>
                  <li>Select the cryptocurrency for which you want to generate a wallet address</li>
                  <li>Click on the "Deposit" button</li>
                  <li>Copy the generated wallet address</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 4: Start Trading</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Deposit funds using the wallet address</li>
                  <li>Navigate to the "Trade" section</li>
                  <li>Transfer funds to your trading account if necessary</li>
                  <li>Begin trading MXTK and other cryptocurrencies</li>
                </ul>
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
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Go to the MetaMask website and click "Download"</li>
                  <li>Choose the appropriate version for your browser</li>
                  <li>Follow the prompts to add the MetaMask extension</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 2: Create a New Wallet</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Click on the MetaMask icon in your browser toolbar</li>
                  <li>Choose "Create a Wallet"</li>
                  <li>Set a strong password for your MetaMask wallet</li>
                  <li>Agree to the Terms of Use and click "Create"</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 3: Secure Your Wallet</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Write down your 12-word secret backup phrase on paper</li>
                  <li>Store it in a secure place - do not save it digitally</li>
                  <li>Confirm your seed phrase by selecting the words in order</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 4: Add Arbitrum Network</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Click on the network dropdown at the top of MetaMask</li>
                  <li>Select "Add Network" or "Custom RPC"</li>
                  <li>Add Arbitrum One with these details:</li>
                  <li className="pl-5">Network Name: Arbitrum One</li>
                  <li className="pl-5">RPC URL: https://arb1.arbitrum.io/rpc</li>
                  <li className="pl-5">Chain ID: 42161</li>
                  <li className="pl-5">Currency Symbol: ETH</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 5: Connect to DApps</h4>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>Navigate to Uniswap or other DApps</li>
                  <li>MetaMask will prompt you to connect your wallet</li>
                  <li>Authorize the connection to begin trading</li>
                </ul>
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
