import Card from '@/components/ui/Card'
import { BulletItem, BulletList } from '@/components/ui/List'

export default function PrivacyPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          This Privacy Policy describes how Mineral Token collects, uses, and protects your personal information.
        </p>
      </section>

      {/* Privacy Content */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">1. Information We Collect</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We collect information you provide directly to us, such as when you contact us, sign up for our services, 
              or participate in our programs.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Personal Information:</h3>
              <BulletList>
                <BulletItem title="Name, email address, and contact information" />
                <BulletItem title="Professional and business information" />
                <BulletItem title="Financial and investment information" />
                <BulletItem title="KYC/AML documentation and verification data" />
              </BulletList>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Technical Information:</h3>
              <BulletList>
                <BulletItem title="IP address and device information" />
                <BulletItem title="Browser type and version" />
                <BulletItem title="Website usage data and analytics" />
                <BulletItem title="Cookies and similar tracking technologies" />
              </BulletList>
            </div>
          </div>
        </Card>
      </section>

      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">2. How We Use Your Information</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We use the information we collect to provide, maintain, and improve our services, comply with legal 
              obligations, and protect our rights and the rights of others.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Primary Uses:</h3>
              <BulletList>
                <BulletItem title="Provide and maintain our website and services" />
                <BulletItem title="Process transactions and manage accounts" />
                <BulletItem title="Comply with KYC/AML and regulatory requirements" />
                <BulletItem title="Communicate with you about our services" />
                <BulletItem title="Improve our services and develop new features" />
                <BulletItem title="Protect against fraud and ensure security" />
              </BulletList>
            </div>
          </div>
        </Card>
      </section>

      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">3. Information Sharing</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your 
              consent, except as described in this policy.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">We may share information with:</h3>
              <BulletList>
                <BulletItem title="Service providers who assist in our operations" />
                <BulletItem title="Regulatory authorities as required by law" />
                <BulletItem title="Legal and compliance advisors" />
                <BulletItem title="Partners in our ecosystem (with your consent)" />
                <BulletItem title="Law enforcement when required by law" />
              </BulletList>
            </div>
            <p className="text-muted text-sm">
              We require all third parties to maintain appropriate security measures and use your information only 
              for the purposes specified.
            </p>
          </div>
        </Card>
      </section>

      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">4. Data Security</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Security Measures:</h3>
              <BulletList>
                <BulletItem title="Encryption of data in transit and at rest" />
                <BulletItem title="Multi-factor authentication systems" />
                <BulletItem title="Regular security audits and assessments" />
                <BulletItem title="Access controls and monitoring" />
                <BulletItem title="Employee training on data protection" />
              </BulletList>
            </div>
            <p className="text-muted text-sm">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. 
              We cannot guarantee absolute security.
            </p>
          </div>
        </Card>
      </section>

      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">5. Data Retention</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
              policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Retention Periods:</h3>
              <BulletList>
                <BulletItem title="Account information: Duration of account plus 7 years" />
                <BulletItem title="Transaction records: 7 years for tax and regulatory compliance" />
                <BulletItem title="KYC/AML documentation: As required by law (typically 5-7 years)" />
                <BulletItem title="Website analytics: 2 years" />
                <BulletItem title="Marketing communications: Until you opt out" />
              </BulletList>
            </div>
          </div>
        </Card>
      </section>

      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">6. Your Rights</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Depending on your location, you may have certain rights regarding your personal information.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Your Rights May Include:</h3>
              <BulletList>
                <BulletItem title="Access to your personal information" />
                <BulletItem title="Correction of inaccurate information" />
                <BulletItem title="Deletion of your personal information" />
                <BulletItem title="Restriction of processing" />
                <BulletItem title="Data portability" />
                <BulletItem title="Objection to processing" />
                <BulletItem title="Withdrawal of consent" />
              </BulletList>
            </div>
            <p className="text-muted text-sm">
              To exercise these rights, please contact us using the information provided below. We will respond to 
              your request within the timeframes required by applicable law.
            </p>
          </div>
        </Card>
      </section>

      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">7. Cookies and Tracking</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We use cookies and similar tracking technologies to enhance your experience on our website and 
              analyze usage patterns.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Types of Cookies:</h3>
              <BulletList>
                <BulletItem title="Essential cookies for website functionality" />
                <BulletItem title="Analytics cookies to understand usage patterns" />
                <BulletItem title="Preference cookies to remember your settings" />
                <BulletItem title="Marketing cookies for targeted advertising" />
              </BulletList>
            </div>
            <p className="text-muted text-sm">
              You can control cookie settings through your browser preferences. However, disabling certain cookies 
              may affect website functionality.
            </p>
          </div>
        </Card>
      </section>

      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">8. International Transfers</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Your personal information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>
            <p className="text-muted">
              When we transfer personal information internationally, we rely on adequacy decisions, standard 
              contractual clauses, or other appropriate safeguards as required by applicable law.
            </p>
          </div>
        </Card>
      </section>

      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">9. Changes to This Policy</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. 
              We will notify you of any material changes by posting the updated policy on our website.
            </p>
            <p className="text-muted">
              Your continued use of our services after any changes indicates your acceptance of the updated policy.
            </p>
          </div>
        </Card>
      </section>

      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">10. Contact Us</h2>
          <p className="text-muted mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@mineral-token.com" className="text-accent hover:underline">
                privacy@mineral-token.com
              </a>
            </p>
            <p>
              <strong>General Contact:</strong>{' '}
              <a href="mailto:info@mineral-token.com" className="text-accent hover:underline">
                info@mineral-token.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> Mineral Token Privacy Officer
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}