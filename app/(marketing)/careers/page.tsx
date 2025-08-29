import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'
import { BulletItem, BulletList } from '@/components/ui/List'

export default function Careers() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">Careers</h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Employment opportunities with Mineral Token.
          </p>
        </section>
      </PageHero>

      {/* Company Overview */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Company Overview</h2>
          <p className="text-muted mb-6">
            Mineral Token is a rapidly growing and innovative cryptocurrency company that is redefining the financial landscape through cutting-edge blockchain technologies and groundbreaking solutions. As a leader in the hyper-growth phase, we are seeking dynamic and seasoned professionals to join our executive team.
          </p>
          
          <h3 className="text-lg font-semibold mb-4">Benefits include:</h3>
          <BulletList>
            <BulletItem title="Competitive salary and performance-based incentives" />
            <BulletItem title="Comprehensive health, dental, and vision plans" />
            <BulletItem title="Stock options and equity participation" />
            <BulletItem title="Professional development opportunities" />
            <BulletItem title="Flexible work arrangements" />
            <BulletItem title="Collaborative and dynamic work environment" />
          </BulletList>
        </Card>
      </section>

      {/* Open Positions */}
      <section className="section-navy">
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
                  <BulletList>
                    <BulletItem title="Provide strategic leadership and direction for the entire engineering function" />
                    <BulletItem title="Drive innovation and maintain a forward-thinking approach to technology trends" />
                    <BulletItem title="Understand and navigate the complexities of financial markets" />
                  </BulletList>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Team Development</h5>
                  <BulletList>
                    <BulletItem title="Recruit, mentor, and lead a world-class engineering team" />
                    <BulletItem title="Implement effective talent development strategies" />
                    <BulletItem title="Foster a culture of collaboration, innovation, and excellence" />
                  </BulletList>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Product Development</h5>
                  <BulletList>
                    <BulletItem title="Collaborate closely with cross-functional teams" />
                    <BulletItem title="Oversee the full product development lifecycle" />
                    <BulletItem title="Meet aggressive timelines and quality standards" />
                  </BulletList>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Technology Stack</h5>
                  <BulletList>
                    <BulletItem title="Define and implement scalable, robust, and secure architectures" />
                    <BulletItem title="Evaluate and select appropriate technologies and frameworks" />
                    <BulletItem title="Drive operational excellence in system performance" />
                  </BulletList>
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
                  <BulletList>
                    <BulletItem title="Develop comprehensive risk management frameworks" />
                    <BulletItem title="Monitor global asset tracking and management" />
                    <BulletItem title="Analyze leverage and trading risks" />
                  </BulletList>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Compliance & Operations</h5>
                  <BulletList>
                    <BulletItem title="Ensure regulatory compliance across jurisdictions" />
                    <BulletItem title="Implement operational risk controls" />
                    <BulletItem title="Manage liquidity pool risk management" />
                  </BulletList>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* How to Apply */}
      <section className="section-teal">
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
      </section>
    </div>
  )
}
