'use client'

import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import { BulletList } from '@/components/ui/BulletList'
import Card from '@/components/ui/Card'
import PhotoBackdrop from '@/components/visuals/PhotoBackdrop'

export default function Careers() {
  const { mode, pageCopy } = useCopy('careers');
  const contentMode = (mode === 'ai') ? 'build' : mode;

  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <PhotoBackdrop src="art/photos/careers_amber.jpg" />
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <ModeTextSwap
            as="h1"
            depKey={`careers-hero-title-${mode}`}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            content={pageCopy.heroTitle[contentMode]}
          />
          <ModeTextSwap
            as="p"
            depKey={`careers-hero-sub-${mode}`}
            className="text-xl max-w-3xl mx-auto"
            content={pageCopy.heroSub[contentMode]}
          />
        </SectionWrapper>

      <SectionWrapper index={1}>
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Company Overview</h2>
          <p className="text-muted mb-6">
            Mineral Token is a rapidly growing and innovative cryptocurrency company that is redefining the financial landscape through cutting-edge blockchain technologies and groundbreaking solutions. As a leader in the hyper-growth phase, we are seeking dynamic and seasoned professionals to join our executive team.
          </p>
          
          <h3 className="text-lg font-semibold mb-4">Benefits include:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BulletList 
              items={[
                { title: 'Competitive compensation' },
                { title: 'Health, dental, vision' },
              ]} 
            />
            <BulletList 
              items={[
                { title: 'Equity participation' },
                { title: 'Professional growth' },
              ]} 
            />
            <BulletList 
              items={[
                { title: 'Flexible work' },
                { title: 'Collaborative culture' },
              ]} 
            />
          </div>
        </Card>
      </SectionWrapper>

      <SectionWrapper index={2}>
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
          <p className="text-muted mb-8">
            If you are a visionary leader looking to make a significant impact in a high-growth company, we invite you to apply and be a key driver of our success. Join us on our exciting journey to redefine the future of Blockchain/Fintech!
          </p>
          <p className="text-muted mb-8">
            Currently, Mineral Token is seeking strong candidates for the following positions:
          </p>

          {/* VP Engineering */}
          <div className="space-y-6 mb-12">
            <div className="border-b border-border pb-4">
              <h3 className="text-xl font-semibold mb-2">Vice President of Engineering</h3>
              <p className="text-muted mb-4">
                This individual will play a pivotal role in driving the technical vision, strategy, and execution of our products, ensuring we maintain our position as an industry leader.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Pay Range:</span>
                  <br />$250k - $400k
                </div>
                <div>
                  <span className="font-semibold">Location:</span>
                  <br />Austin, TX or Miami, FL
                </div>
                <div>
                  <span className="font-semibold">Type:</span>
                  <br />Full-time Executive
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Key Responsibilities:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Technical Leadership</h5>
                  <BulletList 
                    items={[
                      { title: 'Strategic technical leadership' },
                      { title: 'Innovation & trends' },
                      { title: 'Financial markets fluency' },
                    ]} 
                  />
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Team Development</h5>
                  <BulletList 
                    items={[
                      { title: 'Hire & mentor' },
                      { title: 'Talent development' },
                      { title: 'Culture of excellence' },
                    ]} 
                  />
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Product Development</h5>
                  <BulletList 
                    items={[
                      { title: 'Cross-functional collaboration' },
                      { title: 'Full lifecycle ownership' },
                      { title: 'Timeline & quality' },
                    ]} 
                  />
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Technology Stack</h5>
                  <BulletList 
                    items={[
                      { title: 'Scalable architectures' },
                      { title: 'Tech selection' },
                      { title: 'Operational excellence' },
                    ]} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VP Risk Management */}
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-xl font-semibold mb-2">Vice President of Risk Management</h3>
              <p className="text-muted mb-4">
                This executive will be responsible for developing and implementing comprehensive risk management strategies across all aspects of our business operations.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Pay Range:</span>
                  <br />$200k - $350k
                </div>
                <div>
                  <span className="font-semibold">Location:</span>
                  <br />Remote / Austin, TX
                </div>
                <div>
                  <span className="font-semibold">Type:</span>
                  <br />Full-time Executive
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Key Responsibilities:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Risk Strategy</h5>
                  <BulletList 
                    items={[
                      { title: 'Risk frameworks' },
                      { title: 'Asset tracking' },
                      { title: 'Leverage & trading risks' },
                    ]} 
                  />
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Compliance & Operations</h5>
                  <BulletList 
                    items={[
                      { title: 'Regulatory compliance' },
                      { title: 'Operational risk controls' },
                      { title: 'Liquidity pool risk' },
                    ]} 
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </SectionWrapper>

      <SectionWrapper index={3}>
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">How to Apply</h2>
          <p className="text-muted mb-4">
            Email your resume, cover letter and preferred position to{' '}
            <a href="mailto:career@mineral-token.com" className="text-accent hover:underline">
              career@mineral-token.com
            </a>
            . Qualified candidates will receive further instructions via email.
          </p>
          <p className="text-sm text-muted italic">Sorry, no recruiters.</p>
        </Card>
      </SectionWrapper>
      </PageHero>
    </PageTheme>
  )
}
