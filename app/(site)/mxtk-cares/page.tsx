'use client'

import BasePathLink from '@/components/BasePathLink'
import OrganizationLogoGrid from '@/components/OrganizationLogoGrid'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'
import PhotoBackdrop from '@/components/visuals/PhotoBackdrop'
import { PLACEHOLDER_ORGANIZATIONS } from '@/lib/placeholders'

export default function MXTKCaresPage() {
  const { mode, pageCopy } = useCopy('mxtk-cares');

  // Filter organizations for success stories (health and disaster relief categories)
  const successStoryOrganizations = PLACEHOLDER_ORGANIZATIONS.filter(
    org => org.category === 'health' || org.category === 'disaster-relief'
  )

  return (
    <PageTheme ink="warm" lift="M" glass="soft">
      <PhotoBackdrop src="art/photos/mxtk_cares_amethyst.jpg" />
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <ModeTextSwap
            as="h1"
            depKey={`mxtk-cares-hero-title-${mode}`}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            content={pageCopy.heroTitle[mode]}
          />
          <ModeTextSwap
            as="p"
            depKey={`mxtk-cares-hero-sub-${mode}`}
            className="text-xl max-w-3xl mx-auto"
            content={pageCopy.heroSub[mode]}
          />
        </SectionWrapper>

        <SectionWrapper index={1}>
        <Card tint="amber" className="text-center">
          <h2 className="text-2xl font-semibold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Nominate</h3>
              <p className="text-sm" style={{color:'var(--ink-muted)'}}>Submit nonprofit candidates for consideration. We're looking for organizations ready to innovate with token-based funding.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">Vote</h3>
              <p className="text-sm" style={{color:'var(--ink-muted)'}}>Community selects the top 100 organizations based on impact potential, transparency, and innovation readiness.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">Distribute & Leverage</h3>
              <p className="text-sm" style={{color:'var(--ink-muted)'}}>MXTK tokens distributed to selected nonprofits with our team's support to maximize their utility during lockup.</p>
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={2}>
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
                Use locked MXTK as collateral for immediate liquidity via partner institutions.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Competitive rates' },
                { title: 'Flexible terms' },
                { title: 'No personal guarantees' },
              ]} />
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">Revenue-Based Financing</h3>
              <p className="text-muted text-sm mb-4">
                Convert future token distributions into upfront capital via revenue-sharing.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Mission-aligned' },
                { title: 'Performance-based' },
                { title: 'Strategic partners' },
              ]} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-lg">Grant Acceleration</h3>
              <p className="text-muted text-sm mb-4">
                Structure MXTK holdings to qualify for grants from foundations and government programs.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Grant writing' },
                { title: 'Compliance/reporting' },
                { title: 'Funder network' },
              ]} />
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">Strategic Partnerships</h3>
              <p className="text-muted text-sm mb-4">
                Build cross-org partnerships and shared resource pools.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Collaboration' },
                { title: 'Shared costs' },
                { title: 'Amplified impact' },
              ]} />
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={3}>
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

          <div className="glass glass--panel p-6">
            <h3 className="font-semibold mb-3">Success Stories</h3>
            <p className="text-muted text-sm mb-6">
              Organizations in our pilot program have successfully leveraged their MXTK grants to:
            </p>
            <FeatureRow cols={2} items={[
              { title: 'Secure $2M low-interest loans' },
              { title: '$5M strategic partnerships' },
              { title: '$3M additional grants' },
              { title: 'Sustainable revenue streams' },
            ]} />
            
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
        </SectionWrapper>

        <SectionWrapper index={4}>
        <Card tint="teal" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get involved</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Ready to transform how your organization accesses and leverages funding? 
            Join the next generation of nonprofit financing.
          </p>
          <BasePathLink to="mxtk-cares#nominate" className="btn-primary">
            Nominate a nonprofit
          </BasePathLink>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={5}>
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Selection criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Impact potential</h3>
              <p className="text-muted text-sm mb-4">
                Organizations with clear, measurable outcomes and the capacity to scale their impact 
                with additional funding.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Proven measurable impact' },
                { title: 'Clear theory of change' },
                { title: 'Scalable program model' },
              ]} />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Transparency</h3>
              <p className="text-muted text-sm mb-4">
                Open about their operations, financials, and impact measurement. 
                Willing to share learnings with the community.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Financial reporting' },
                { title: 'Impact measurement' },
                { title: 'Open communication' },
              ]} />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Innovation readiness</h3>
              <p className="text-muted text-sm mb-4">
                Willing to explore new funding mechanisms and work with our team to maximize 
                the utility of their MXTK grant.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'New financial instruments' },
                { title: 'Adaptive culture' },
                { title: 'Partnership mindset' },
              ]} />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Sustainability</h3>
              <p className="text-muted text-sm mb-4">
                Long-term vision and operational stability. Organizations that can sustain 
                and grow their impact over time.
              </p>
              <FeatureRow cols={2} items={[
                { title: 'Leadership & governance' },
                { title: 'Diversified funding' },
                { title: 'Long-term planning' },
              ]} />
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={6}>
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
        </SectionWrapper>
      </PageHero>
    </PageTheme>
  )
}