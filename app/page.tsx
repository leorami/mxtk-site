'use client'

import Card from '@/components/ui/Card'
import { withBase } from '@/lib/routing/basePath'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Tokenize and Monetize<br />
          <span className="text-accent">Verified Mineral Value</span>
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          MXTK offers compliant, confidential tokenization of mineral assets with transparent governance and verifiable on-chain data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link className="btn-soft" href={mounted ? withBase('/owners') : '/owners'}>Mineral Owners</Link>
          <Link className="btn-soft" href={mounted ? withBase('/transparency') : '/transparency'}>Trust & Transparency</Link>
          <Link className="btn-soft" href={mounted ? withBase('/ecosystem') : '/ecosystem'}>See the Ecosystem</Link>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-amber">
        <Card tint="amber">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Compliant Tokenization</h2>
              <p className="text-muted mb-4">
                MXTK provides a regulated path for mineral asset owners to tokenize their holdings while maintaining compliance with securities laws and regulatory requirements.
              </p>
              <div className="mt-2"><Link className="btn-link" href={mounted ? withBase('/whitepaper') : '/whitepaper'}>How MXTK works</Link></div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Transparent Governance</h2>
              <p className="text-muted mb-4">
                Every material statement about MXTK maps to a verifiable source: on-chain data, IPFS documents, or transparent methodologies.
              </p>
              <div className="mt-2"><Link className="btn-link" href={mounted ? withBase('/transparency') : '/transparency'}>Visit hub</Link></div>
            </div>
          </div>
        </Card>
      </section>

      {/* Ecosystem Overview */}
      <section className="section-teal">
        <Card tint="teal">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Partners & Integrations</h3>
              <p className="text-muted text-sm">Comprehensive ecosystem supporting MXTK.</p>
              <Link className="btn-link" href={mounted ? withBase('/ecosystem') : '/ecosystem'}>Explore</Link>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Educational Resources</h3>
              <p className="text-muted text-sm">Learn about tokenization and MXTK.</p>
              <Link className="btn-link" href={mounted ? withBase('/resources') : '/resources'}>Browse</Link>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Live Data</h3>
              <p className="text-muted text-sm">Real-time metrics and transparency.</p>
              <Link className="btn-link" href={mounted ? withBase('/transparency') : '/transparency'}>View</Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}