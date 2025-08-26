import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'

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
          <ul className="list-disc pl-5 text-muted space-y-2">
            <li>Competitive salary and performance-based incentives</li>
            <li>Comprehensive health, dental, and vision plans</li>
            <li>Stock options and equity participation</li>
            <li>Professional development opportunities</li>
            <li>Flexible work arrangements</li>
            <li>Collaborative and dynamic work environment</li>
          </ul>
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
                  <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Provide strategic leadership and direction for the entire engineering function</li>
                    <li>Drive innovation and maintain a forward-thinking approach to technology trends</li>
                    <li>Understand and navigate the complexities of financial markets</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Team Development</h5>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Recruit, mentor, and lead a world-class engineering team</li>
                    <li>Implement effective talent development strategies</li>
                    <li>Foster a culture of collaboration, innovation, and excellence</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Product Development</h5>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Collaborate closely with cross-functional teams</li>
                    <li>Oversee the full product development lifecycle</li>
                    <li>Meet aggressive timelines and quality standards</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Technology Stack</h5>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Define and implement scalable, robust, and secure architectures</li>
                    <li>Evaluate and select appropriate technologies and frameworks</li>
                    <li>Drive operational excellence in system performance</li>
                  </ul>
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
                  <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Develop comprehensive risk management frameworks</li>
                    <li>Monitor global asset tracking and management</li>
                    <li>Analyze leverage and trading risks</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Compliance & Operations</h5>
                  <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                    <li>Ensure regulatory compliance across jurisdictions</li>
                    <li>Implement operational risk controls</li>
                    <li>Manage liquidity pool risk management</li>
                  </ul>
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
