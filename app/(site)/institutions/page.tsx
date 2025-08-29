'use client'

import PageHero from '@/components/PageHero'
import SectionGrid from '@/components/SectionGrid'
import SectionWrapper from '@/components/SectionWrapper'
import { Item, Reveal, RevealStagger } from '@/components/animations/Reveal'
// FullBleed removed per revert
import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import Card from '@/components/ui/Card'
import { BulletItem, BulletList } from '@/components/ui/List'
import PageBackground from '@/components/visuals/PageBackground'
import { usePublicPath } from '@/lib/routing/getPublicPathClient'
import { usePathname } from 'next/navigation'

export default function InstitutionsPage() {
  const pathname = usePathname() || '/'
  return (
    <div className="space-y-0">
      <PageBackground src="art/backgrounds/institutions_lapis.jpg" />
      {/* Hero */}
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            For Traders & Institutions
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <img src={usePublicPath('icons/mineral/icon-droplet.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
            <img src={usePublicPath('icons/mineral/icon-lattice.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
            <img src={usePublicPath('icons/mineral/icon-sparkle.svg')} alt="" role="presentation" aria-hidden="true" className="w-6 h-6 opacity-70" />
          </div>
          <Reveal>
            <p className="text-xl max-w-3xl mx-auto">
              MXTK offers institutional-grade infrastructure for trading and custody of tokenized mineral interests, with transparent pricing and deep liquidity.
            </p>
          </Reveal>
        </SectionWrapper>
      </PageHero>

      {/* Token Information */}
      <SectionWrapper index={1}>
        <Card tint="amber">
          <SectionGrid
            left={<div>
              <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
              <Reveal><OnchainSummary /></Reveal>
            </div>}
            right={<div className="relative">
              <Reveal delay={0.1}>
                <img src={usePublicPath('minerals/photos/lapis-lazuli-crystal.svg')} alt="Lapis crystal" className="w-full max-w-md mx-auto opacity-90" />
              </Reveal>
            </div>}
          />
        </Card>
      </SectionWrapper>

      {/* Liquidity Pools */}
      <SectionWrapper index={2}>
        <Card tint="teal">
          <Reveal>
            <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
          </Reveal>
          <Reveal delay={0.05}><PoolTable /></Reveal>
        </Card>
      </SectionWrapper>

      {/* Scale of Operations */}
      <SectionWrapper index={3}>
        <Card tint="teal">
          <SectionGrid
            reverseOnDesktop
            left={<Reveal>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Scale of Operations</h3>
                <p className="text-muted mb-4">
                  Large-scale mining operations demonstrate the substantial value of mineral assets that can be tokenized through MXTK. Our platform supports assets of all sizes, from small claims to major mining operations.
                </p>
                <p className="text-muted text-sm">
                  The tokenization process maintains the same rigorous standards regardless of asset size, ensuring consistent quality and transparency across all listings.
                </p>
              </div>
            </Reveal>}
            right={<Reveal delay={0.1}>
              <img src={usePublicPath('minerals/photos/lapis-lazuli-crystal.svg')} alt="Lapis crystal" className="w-full max-w-md mx-auto opacity-90" />
            </Reveal>}
          />
        </Card>
      </SectionWrapper>

      {/* Infrastructure */}
      <SectionWrapper index={4}>
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Infrastructure & Security</h2>
          <SectionGrid
            left={<div>
              <h3 className="font-semibold mb-3">Smart Contracts</h3>
              <div className="text-sm">
                <RevealStagger>
                  <Item><BulletItem title="Token (Arbitrum): 0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba" /></Item>
                  <Item><BulletItem title="Uniswap v4 Pool: Coming soon" /></Item>
                  <Item><BulletItem title="LP Locker: Coming soon" /></Item>
                  <Item><BulletItem title="Multisig: 3-of-5 governance" /></Item>
                  <Item><BulletItem title="Timelock: 48-hour delay" /></Item>
                </RevealStagger>
              </div>
            </div>}
            right={<div>
              <h3 className="font-semibold mb-3">Security Features</h3>
              <div className="text-sm">
                <RevealStagger>
                  <Item><BulletItem title="Multi-signature governance" /></Item>
                  <Item><BulletItem title="Timelock-protected upgrades" /></Item>
                  <Item><BulletItem title="Emergency pause mechanisms" /></Item>
                  <Item><BulletItem title="Regular security audits" /></Item>
                  <Item><BulletItem title="Transparent change logs" /></Item>
                </RevealStagger>
              </div>
            </div>}
          />
        </Card>
      </SectionWrapper>

      {/* Trading Features */}
      <SectionWrapper index={5}>
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Trading Features</h2>
          <RevealStagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <Item>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">💱</div>
                  <h3 className="font-semibold mb-2">DEX Trading</h3>
                  <p className="text-muted text-sm">Uniswap v4 pools with concentrated liquidity and advanced AMM features</p>
                </div>
              </Item>
              <Item>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">🏦</div>
                  <h3 className="font-semibold mb-2">OTC Markets</h3>
                  <p className="text-muted text_sm">Institutional-grade OTC desks with proper settlement and custody</p>
                </div>
              </Item>
              <Item>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">📊</div>
                  <h3 className="font-semibold mb-2">Price Feeds</h3>
                  <p className="text-muted text-sm">Transparent oracle pricing with documented methodology</p>
                </div>
              </Item>
            </div>
          </RevealStagger>
        </Card>
      </SectionWrapper>

      {/* Compliance */}
      <SectionWrapper index={6}>
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Compliance & Custody</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold mb-3">Regulatory Framework</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="KYC/AML compliance" />
                  <BulletItem title="Institutional custody" />
                  <BulletItem title="Regulatory reporting" />
                  <BulletItem title="Tax documentation" />
                  <BulletItem title="Legal structure" />
                </BulletList>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Custody Solutions</h3>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Qualified custodian support" />
                  <BulletItem title="Multi-signature controls" />
                  <BulletItem title="Insurance coverage" />
                  <BulletItem title="Audit trails" />
                  <BulletItem title="Settlement automation" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </SectionWrapper>

      <OrganicBand tint="lapis" className="py-14 md:py-20">
        <div className="mask-organic relative">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass p-6">
                <h3 className="text-lg font-semibold">Compliance-minded</h3>
                <p className="text-sm opacity-80">Clear mechanics; auditable, programmatic flow.</p>
              </div>
              <div className="glass p-6">
                <h3 className="text-lg font-semibold">Operationally simple</h3>
                <p className="text-sm opacity-80">Fast to understand, fast to integrate.</p>
              </div>
              <div className="glass p-6">
                <h3 className="text-lg font-semibold">Risk-aware</h3>
                <p className="text-sm opacity-80">Structure emphasizes resilience and transparency.</p>
              </div>
            </div>
            <div className="mt-8">
              <BulletList>
                <BulletItem title="Interoperable">Works with your existing infrastructure.</BulletItem>
                <BulletItem title="Programmatic controls">Policy surfaces map to expected governance.</BulletItem>
              </BulletList>
            </div>
          </div>
        </div>
      </OrganicBand>
    </div>
  )
}