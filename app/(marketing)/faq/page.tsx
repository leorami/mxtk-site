"use client"
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import { BulletList } from '@/components/ui/BulletList'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function FAQ() {
  const { mode, pageCopy } = useCopy('faq')
  const contentMode = (mode === 'ai') ? 'build' : mode;
  return (
    <PageTheme ink="warm" lift="H" glass="soft">
      <BackgroundPhoto variant="faq" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <ModeTextSwap as="h1" depKey={`faq-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[contentMode]} />
              <ModeTextSwap as="p" depKey={`faq-hero-sub-${mode}`} className="text-xl text-muted max-w-3xl mx-auto" content={pageCopy.heroSub[contentMode]} />
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-2xl font-semibold mb-6">How to find MXTK</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Uniswap (Arbitrum)</h3>
                    <p className="text-muted text-sm">Primary DEX for MXTK</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">CoinGecko</h3>
                    <p className="text-muted text-sm">Price tracking and metadata</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-3">Arbiscan</h3>
                    <p className="text-muted text-sm">Token details and holders</p>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={2}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">How to Guides</h2>
                <div className="space-y-6 mb-12">
                  <h3 className="text-xl font-semibold">Setting up a wallet in Bitget</h3>
                  <p className="text-muted mb-4">Setting up a wallet in Bitget involves creating an account, securing it with two-factor authentication (2FA), and generating wallet addresses for different cryptocurrencies.</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Step 1: Create a Bitget Account</h4>
                      <BulletList 
                        items={[
                          { title: 'Sign up on Bitget' },
                          { title: 'Verify email/phone' },
                          { title: 'Set a strong password' },
                          { title: 'Agree to terms' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 2: Secure Your Account with 2FA</h4>
                      <BulletList 
                        items={[
                          { title: 'Open Security settings' },
                          { title: 'Enable Two-Factor Auth' },
                          { title: 'Use Authenticator app' },
                          { title: 'Confirm 6-digit code' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 3: Generate Wallet Addresses</h4>
                      <BulletList 
                        items={[
                          { title: 'Open Wallet' },
                          { title: 'Choose asset' },
                          { title: 'Tap Deposit' },
                          { title: 'Copy address' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 4: Start Trading</h4>
                      <BulletList 
                        items={[
                          { title: 'Deposit funds' },
                          { title: 'Open Trade section' },
                          { title: 'Transfer to trading account' },
                          { title: 'Trade MXTK' },
                        ]} 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Setting up a wallet in MetaMask</h3>
                  <p className="text-muted mb-4">Setting up a wallet in MetaMask involves creating an account, securing it with a seed phrase, and connecting to different blockchain networks.</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Step 1: Install MetaMask</h4>
                      <BulletList 
                        items={[
                          { title: 'Visit metamask.io' },
                          { title: 'Download extension' },
                          { title: 'Install for browser' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 2: Create a New Wallet</h4>
                      <BulletList 
                        items={[
                          { title: 'Open extension' },
                          { title: 'Create a Wallet' },
                          { title: 'Set strong password' },
                          { title: 'Agree to terms' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 3: Secure Your Wallet</h4>
                      <BulletList 
                        items={[
                          { title: 'Write seed phrase' },
                          { title: 'Store safely' },
                          { title: 'Confirm words in order' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 4: Add Arbitrum Network</h4>
                      <BulletList 
                        items={[
                          { title: 'Open network dropdown' },
                          { title: 'Add Network' },
                          { title: 'RPC: https://arb1.arbitrum.io/rpc' },
                          { title: 'Chain ID: 42161' },
                        ]} 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Step 5: Connect to DApps</h4>
                      <BulletList 
                        items={[
                          { title: 'Open Uniswap' },
                          { title: 'Connect wallet' },
                          { title: 'Authorize access' },
                        ]} 
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="teal">
                <h2 className="text-2xl font-semibold mb-6">Need Help?</h2>
                <p className="text-muted mb-4">If you need assistance with setting up your wallet or have questions about MXTK, please reach out to us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:info@mineral-token.com" className="text-accent hover:underline">info@mineral-token.com</a></p>
                  <p><strong>Telegram:</strong> <a href="https://t.me/mineraltoken" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@mineraltoken</a></p>
                </div>
              </Card>
            </SectionWrapper>
          </div>
        </div>
      </PageHero>
      {pageCopy.sections?.map((sec, idx) => (
        <section key={`${idx}-${mode}`} className="mt-10">
          <div className="glass glass--panel p-6 md:p-8 rounded-xl">
            <ModeTextSwap
              as="h2"
              depKey={`faq-sec-${idx}-heading-${mode}`}
              className="text-xl md:text-2xl font-semibold h-on-gradient"
              content={sec.heading[contentMode]}
            />
            <div className="mt-4 space-y-4 sub-on-gradient">
              {sec.paragraphs[contentMode].map((p, i) => (
                <ModeTextSwap
                  key={i}
                  as="p"
                  depKey={`faq-sec-${idx}-p-${i}-${mode}`}
                  className="leading-relaxed"
                  content={p}
                />
              ))}
            </div>
            {sec.highlight?.[contentMode] ? (
              <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                <ModeTextSwap
                  as="div"
                  depKey={`faq-sec-${idx}-hl-${mode}`}
                  className="text-sm opacity-90"
                  content={sec.highlight[contentMode]}
                />
              </div>
            ) : null}
          </div>
        </section>
      ))}
    </PageTheme>
  )
}
