import BasePathLink from '@/components/BasePathLink'
import OrganizationLogoGrid from '@/components/OrganizationLogoGrid'
import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'
import { BulletItem, BulletList } from '@/components/ui/List'
import OrganicBand from '@/components/visuals/OrganicBand'
import { PLACEHOLDER_ORGANIZATIONS } from '@/lib/placeholders'

export default function MXTKCaresPage() {

  // Filter organizations for success stories (health and disaster relief categories)
  const successStoryOrganizations = PLACEHOLDER_ORGANIZATIONS.filter(
    org => org.category === 'health' || org.category === 'disaster-relief'
  )

  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            MXTK Cares
          </h1>
          <p className="text-xl text-muted max-w-4xl mx-auto">
            Up to $10M (today's dollars) in MXTK tokens to 100 nonprofits—innovative funding that works for you, 
            even while tokens are locked for tradability.
          </p>
        </section>
      </PageHero>

      {/* How it works - Updated */}
      <section className="section-amber">
        <Card tint="amber" className="text-center">
          <h2 className="text-2xl font-semibold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Nominate</h3>
              <p className="text-muted text-sm">Submit nonprofit candidates for consideration. We're looking for organizations ready to innovate with token-based funding.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">Vote</h3>
              <p className="text-muted text-sm">Community selects the top 100 organizations based on impact potential, transparency, and innovation readiness.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">Distribute & Leverage</h3>
              <p className="text-muted text-sm">MXTK tokens distributed to selected nonprofits with our team's support to maximize their utility during lockup.</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Leveraging MXTK Grants */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Leveraging Your MXTK Grant</h2>
          <p className="text-lg mb-6">
            While your MXTK tokens are locked for tradability, our team works with you to unlock their full potential 
            through innovative financial instruments and partnerships.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Token-Backed Loans</h3>
              <p className="text-muted text-sm mb-4">
                Use your locked MXTK tokens as collateral to secure traditional loans from our partner financial institutions. 
                This provides immediate liquidity while maintaining your token position.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Competitive interest rates based on token value" />
                  <BulletItem title="Flexible repayment terms" />
                  <BulletItem title="No personal guarantees required" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-lg">Revenue-Based Financing</h3>
              <p className="text-muted text-sm mb-4">
                Convert future MXTK token distributions into upfront capital through revenue-sharing agreements 
                with our network of impact investors.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Aligns with your mission and growth" />
                  <BulletItem title="Flexible repayment tied to performance" />
                  <BulletItem title="Access to strategic partnerships" />
                </BulletList>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Grant Acceleration</h3>
              <p className="text-muted text-sm mb-4">
                Our team helps you structure your MXTK holdings to qualify for additional grants and funding 
                from foundations and government programs.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Expert grant writing support" />
                  <BulletItem title="Compliance and reporting assistance" />
                  <BulletItem title="Network access to funders" />
                </BulletList>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-lg">Strategic Partnerships</h3>
              <p className="text-muted text-sm mb-4">
                Leverage your MXTK position to form strategic partnerships with other grantees, 
                creating collaborative funding pools and shared resources.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Cross-organizational collaboration" />
                  <BulletItem title="Shared administrative costs" />
                  <BulletItem title="Amplified impact potential" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Our Support During Lockup */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Our Support During Lockup</h2>
          <p className="text-lg mb-6">
            We don't just give you tokens—we give you a partnership. Our dedicated team works with you throughout 
            the lockup period to maximize the impact of your MXTK grant.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Financial Advisory</h3>
              <p className="text-muted text-sm">
                Expert guidance on structuring loans, managing cash flow, and optimizing your token position 
                for maximum impact.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Technical Support</h3>
              <p className="text-muted text-sm">
                Help with token management, compliance reporting, and integration with your existing 
                financial systems.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Network Access</h3>
              <p className="text-muted text-sm">
                Connect with our network of lenders, investors, and other nonprofits to create 
                opportunities for collaboration and growth.
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Success Stories</h3>
            <p className="text-muted text-sm mb-6">
              Organizations in our pilot program have successfully leveraged their MXTK grants to:
            </p>
            <div className="text-sm mb-6">
              <BulletList>
                <BulletItem title="Secure $2M in low-interest loans for program expansion" />
                <BulletItem title="Form strategic partnerships worth $5M in combined resources" />
                <BulletItem title="Qualify for additional grants totaling $3M" />
                <BulletItem title="Create sustainable revenue streams through innovative financing" />
              </BulletList>
            </div>
            
            {/* Organization Logos */}
            <OrganizationLogoGrid
              organizations={successStoryOrganizations}
              title="Featured Organizations"
              subtitle="Organizations that have successfully leveraged MXTK grants"
              size="md"
              columns={4}
            />
          </div>
        </Card>
      </section>

      {/* Get Involved */}
      <section className="section-teal">
        <Card tint="teal" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get involved</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Ready to transform how your organization accesses and leverages funding? 
            Join the next generation of nonprofit financing.
          </p>
                        <BasePathLink to="elite-drop/nominate" className="btn-primary">
            Nominate a nonprofit
          </BasePathLink>
        </Card>
      </section>

      {/* Selection criteria - Enhanced */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Selection criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Impact potential</h3>
              <p className="text-muted text-sm mb-4">
                Organizations with clear, measurable outcomes and the capacity to scale their impact 
                with additional funding.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Proven track record of measurable impact" />
                  <BulletItem title="Clear theory of change" />
                  <BulletItem title="Scalable program model" />
                </BulletList>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Transparency</h3>
              <p className="text-muted text-sm mb-4">
                Open about their operations, financials, and impact measurement. 
                Willing to share learnings with the community.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Regular financial reporting" />
                  <BulletItem title="Impact measurement systems" />
                  <BulletItem title="Open communication practices" />
                </BulletList>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Innovation readiness</h3>
              <p className="text-muted text-sm mb-4">
                Willing to explore new funding mechanisms and work with our team to maximize 
                the utility of their MXTK grant.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Open to new financial instruments" />
                  <BulletItem title="Adaptive organizational culture" />
                  <BulletItem title="Strategic partnership mindset" />
                </BulletList>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Sustainability</h3>
              <p className="text-muted text-sm mb-4">
                Long-term vision and operational stability. Organizations that can sustain 
                and grow their impact over time.
              </p>
              <div className="text-sm">
                <BulletList>
                  <BulletItem title="Strong leadership and governance" />
                  <BulletItem title="Diversified funding sources" />
                  <BulletItem title="Long-term strategic planning" />
                </BulletList>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Timeline and Process */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Timeline and Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Q1 2025</div>
              <h3 className="font-semibold mb-2">Nominations Open</h3>
              <p className="text-muted text-sm">Submit your organization for consideration</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Q2 2025</div>
              <h3 className="font-semibold mb-2">Community Voting</h3>
              <p className="text-muted text-sm">Top 100 organizations selected</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Q3 2025</div>
              <h3 className="font-semibold mb-2">Token Distribution</h3>
              <p className="text-muted text-sm">MXTK tokens distributed to grantees</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Ongoing</div>
              <h3 className="font-semibold mb-2">Support & Leverage</h3>
              <p className="text-muted text-sm">Our team works with you to maximize impact</p>
            </div>
          </div>
        </Card>
      </section>

      <OrganicBand tint="teal" className="py-14 md:py-20">
        <div className="mask-organic relative">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="glass p-6">
                <h3 className="text-lg font-semibold">Impact, not spin</h3>
                <p className="text-sm opacity-80">Programs designed with outcomes and accountability in mind.</p>
              </div>
              <div className="glass p-6">
                <BulletList>
                  <BulletItem title="Aligned with mission">We start with the ‘why’, then ship the ‘how’.</BulletItem>
                  <BulletItem title="Measurable">Simple KPIs; report the truth, improve fast.</BulletItem>
                  <BulletItem title="Partner-first">We co-design and respect constraints.</BulletItem>
                </BulletList>
              </div>
            </div>
          </div>
        </div>
      </OrganicBand>
    </div>
  )
}