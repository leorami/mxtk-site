'use client'

import PageHero from '@/components/PageHero';
import Card from '@/components/ui/Card';
import { getPublicPath } from '@/lib/routing/basePath';
import { usePathname } from 'next/navigation';

export default function OwnersPage() {
  const pathname = usePathname() || '/'
  return (
    <PageHero>
      <div className="space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6 pt-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-950 dark:text-gray-50">
            For Mineral Owners
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <img src={getPublicPath('icons/mineral/icon-bands.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-droplet.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
            <img src={getPublicPath('icons/mineral/icon-facet.svg', pathname)} alt="" className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
            MXTK offers a compliant, confidential intake path for owners and operators seeking to digitize mineral interests and participate in a transparent, governed token economy.
          </p>
        </section>

        {/* What We Consider */}
        <section className="glass">
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">What We Consider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Geological Documentation</h3>
                <ul className="space-y-2 text-muted">
                  <li>• JORC/NI43-101 technical reports</li>
                  <li>• Resource and reserve estimates</li>
                  <li>• Geological modeling and analysis</li>
                  <li>• Exploration and development plans</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal & Financial</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Chain-of-title verification</li>
                  <li>• Mineral rights documentation</li>
                  <li>• Financial statements and projections</li>
                  <li>• Regulatory compliance status</li>
                </ul>
              </div>
            </div>
            
            {/* What We Consider supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/owners_support_facets.jpg', pathname)} alt="Citrine facets" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </section>

        {/* What You Provide */}
        <section className="glass">
          <Card tint="teal">
            <h2 className="text-2xl font-semibold mb-6">What You Provide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">📋</div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-muted text-sm">Technical reports, legal documents, and financial records</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">🔍</div>
                <h3 className="font-semibold mb-2">Access</h3>
                <p className="text-muted text-sm">Site visits, data room access, and expert consultations</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">🤝</div>
                <h3 className="font-semibold mb-2">Cooperation</h3>
                <p className="text-muted text-sm">Due diligence support and ongoing communication</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Process Steps */}
        <section className="glass">
          <Card tint="navy">
            <h2 className="text-2xl font-semibold mb-6">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">🔍</div>
                <h3 className="text-xl font-semibold mb-3">Discovery</h3>
                <p className="text-muted">Initial assessment and preliminary documentation review</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">✅</div>
                <h3 className="text-xl font-semibold mb-3">Verification</h3>
                <p className="text-muted">Independent review and technical validation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4 text-accent">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Onboarding</h3>
                <p className="text-muted">Tokenization and market integration</p>
              </div>
            </div>
            
            {/* Process supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/owners_support_veins.jpg', pathname)} alt="Citrine veins" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </section>

        {/* Inline Photo with Copy */}
        <section className="glass">
          <Card tint="amber">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <figure className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={getPublicPath('media/inline-miners-1600x900.jpg', pathname)}
                  alt="Underground mining crew during operations"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <figcaption className="text-xs text-slate-500 dark:text-slate-400 p-3">
                  Field work is evaluated against accepted reporting standards before any claim is listed.
                </figcaption>
              </figure>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Field Verification</h3>
                <p className="text-muted mb-4">
                  Our team conducts thorough field assessments to verify mineral claims and ensure compliance with industry standards. This includes on-site inspections, sample collection, and documentation review.
                </p>
                <p className="text-muted text-sm">
                  Every mineral asset undergoes rigorous evaluation before being considered for tokenization, ensuring transparency and accuracy in our reporting.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Confidentiality */}
        <section className="glass">
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">Confidentiality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Data Protection</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Secure data room access</li>
                  <li>• Non-disclosure agreements</li>
                  <li>• Redacted public disclosures</li>
                  <li>• Controlled information flow</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Privacy Controls</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Owner identity protection</li>
                  <li>• Sensitive data redaction</li>
                  <li>• Limited public exposure</li>
                  <li>• Confidential settlement terms</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Benefits for Owners */}
        <section className="glass">
          <Card tint="teal">
            <h2 className="text-2xl font-semibold mb-6">Benefits for Owners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">💰</div>
                <h3 className="font-semibold mb-2">Liquidity</h3>
                <p className="text-muted text-sm">Access to global capital markets and trading liquidity</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">📈</div>
                <h3 className="font-semibold mb-2">Value Discovery</h3>
                <p className="text-muted text-sm">Market-driven pricing and transparent valuation</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">🔒</div>
                <h3 className="font-semibold mb-2">Security</h3>
                <p className="text-muted text-sm">Blockchain-based ownership and transfer security</p>
              </div>
            </div>
            
            {/* Benefits supporting image - temporarily removed for cleaner look */}
            {/* <img src={getPublicPath('minerals/supporting/owners_support_bands.jpg', pathname)} alt="Citrine bands" className="w-full rounded-xl shadow my-6" loading="lazy" /> */}
          </Card>
        </section>
      </div>
    </PageHero>
  );
}