'use client'

import PageHero from '@/components/PageHero'
import OnchainSummary from '@/components/live/OnchainSummary'
import PoolTable from '@/components/live/PoolTable'
import Card from '@/components/ui/Card'
import { getPublicPath } from '@/lib/routing/basePath'
import { usePathname } from 'next/navigation'

export default function InstitutionsPage() {
  const pathname = usePathname() || '/'
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-950 dark:text-gray-50">
            For Traders & Institutions
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <img src={getPublicPath('icons/mineral/icon-droplet.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-lattice.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-sparkle.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
            MXTK offers institutional-grade infrastructure for trading and custody of tokenized mineral interests, with transparent pricing and deep liquidity.
          </p>
        </section>
      </PageHero>

      {/* Token Information */}
      <section className="glass">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
          <OnchainSummary />
          
          {/* Intro/liquidity depth supporting image - temporarily removed for cleaner look */}
          {/* <img src={getPublicPath('minerals/supporting/institutions_support_depth.jpg', pathname)} alt="Lapis depth" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
        </Card>
      </section>

      {/* Liquidity Pools */}
      <section className="glass">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
          <PoolTable />
        </Card>
      </section>

      {/* Scale of Operations */}
      <section className="glass">
        <Card tint="teal">
          <div>
            <h3 className="font-semibold mb-3 text-lg">Scale of Operations</h3>
            <p className="text-muted mb-4">
              Large-scale mining operations demonstrate the substantial value of mineral assets that can be tokenized through MXTK. Our platform supports assets of all sizes, from small claims to major mining operations.
            </p>
            <p className="text-muted text-sm">
              The tokenization process maintains the same rigorous standards regardless of asset size, ensuring consistent quality and transparency across all listings.
            </p>
          </div>
        </Card>
      </section>

      {/* Infrastructure */}
      <section className="glass">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Infrastructure & Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Smart Contracts</h3>
              <ul className="space-y-2 text-muted">
                <li>• Token (Arbitrum): 0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba</li>
                <li>• Uniswap v4 Pool: Coming soon</li>
                <li>• LP Locker: Coming soon</li>
                <li>• Multisig: 3-of-5 governance</li>
                <li>• Timelock: 48-hour delay</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Security Features</h3>
              <ul className="space-y-2 text-muted">
                <li>• Multi-signature governance</li>
                <li>• Timelock-protected upgrades</li>
                <li>• Emergency pause mechanisms</li>
                <li>• Regular security audits</li>
                <li>• Transparent change logs</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Trading Features */}
      <section className="glass">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Trading Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">💱</div>
              <h3 className="font-semibold mb-2">DEX Trading</h3>
                              <p className="text-muted text-sm">Uniswap v4 pools with concentrated liquidity and advanced AMM features</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🏦</div>
              <h3 className="font-semibold mb-2">OTC Markets</h3>
              <p className="text-muted text-sm">Institutional-grade OTC desks with proper settlement and custody</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📊</div>
              <h3 className="font-semibold mb-2">Price Feeds</h3>
              <p className="text-muted text-sm">Transparent oracle pricing with documented methodology</p>
            </div>
          </div>
          
          {/* Partner grid/infrastructure supporting image - temporarily removed for cleaner look */}
          {/* <img src={getPublicPath('minerals/supporting/institutions_support_geometry.jpg', pathname)} alt="Lapis geometry" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
        </Card>
      </section>

      {/* Compliance */}
      <section className="glass">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Compliance & Custody</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Regulatory Framework</h3>
              <ul className="space-y-2 text-muted">
                <li>• KYC/AML compliance</li>
                <li>• Institutional custody</li>
                <li>• Regulatory reporting</li>
                <li>• Tax documentation</li>
                <li>• Legal structure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Custody Solutions</h3>
              <ul className="space-y-2 text-muted">
                <li>• Qualified custodian support</li>
                <li>• Multi-signature controls</li>
                <li>• Insurance coverage</li>
                <li>• Audit trails</li>
                <li>• Settlement automation</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}