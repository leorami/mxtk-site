import Card from '@/components/ui/Card'

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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Name, email address, and contact information</li>
                <li>Professional and business information</li>
                <li>Financial and investment information</li>
                <li>KYC/AML documentation and verification data</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Technical Information:</h3>
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Provide and maintain our website and services</li>
                <li>Process transactions and manage accounts</li>
                <li>Comply with KYC/AML and regulatory requirements</li>
                <li>Communicate with you about our services</li>
                <li>Improve our services and develop new features</li>
                <li>Protect against fraud and ensure security</li>
              </ul>
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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Service providers who assist in our operations</li>
                <li>Regulatory authorities as required by law</li>
                <li>Legal and compliance advisors</li>
                <li>Partners in our ecosystem (with your consent)</li>
                <li>Law enforcement when required by law</li>
              </ul>
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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Multi-factor authentication systems</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and monitoring</li>
                <li>Employee training on data protection</li>
              </ul>
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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Account information: Duration of account plus 7 years</li>
                <li>Transaction records: 7 years for tax and regulatory compliance</li>
                <li>KYC/AML documentation: As required by law (typically 5-7 years)</li>
                <li>Website analytics: 2 years</li>
                <li>Marketing communications: Until you opt out</li>
              </ul>
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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
                <li>Withdrawal of consent</li>
              </ul>
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
              <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                <li>Essential cookies for website functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
                <li>Marketing cookies for targeted advertising</li>
              </ul>
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