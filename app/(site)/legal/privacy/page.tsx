import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import { FeatureRow } from '@/components/ui/List'

export default function PrivacyPage() {
  return (
    <PageTheme ink="dark" lift="none">
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto">Effective date: …</p>
        </SectionWrapper>

        <SectionWrapper index={1}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">1. Information We Collect</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We collect information you provide directly to us, such as when you contact us, sign up for our services, 
              or participate in our programs.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Personal Information:</h3>
              <FeatureRow cols={2} items={[
                { title: 'Contact details' },
                { title: 'Professional info' },
                { title: 'Financial information' },
                { title: 'KYC/AML data' },
              ]} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Technical Information:</h3>
              <FeatureRow cols={2} items={[
                { title: 'IP & device data' },
                { title: 'Browser details' },
                { title: 'Usage analytics' },
                { title: 'Cookies & tracking' },
              ]} />
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={2}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">2. How We Use Your Information</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We use the information we collect to provide, maintain, and improve our services, comply with legal 
              obligations, and protect our rights and the rights of others.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Primary Uses:</h3>
              <FeatureRow cols={3} items={[
                { title: 'Provide services' },
                { title: 'Process transactions' },
                { title: 'KYC/AML compliance' },
                { title: 'Communications' },
                { title: 'Improve features' },
                { title: 'Fraud & security' },
              ]} />
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={3}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">3. Information Sharing</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your 
              consent, except as described in this policy.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">We may share information with:</h3>
              <FeatureRow cols={3} items={[
                { title: 'Service providers' },
                { title: 'Regulators' },
                { title: 'Legal advisors' },
                { title: 'Ecosystem partners' },
                { title: 'Law enforcement' },
              ]} />
            </div>
            <p className="text-muted text-sm">
              We require all third parties to maintain appropriate security measures and use your information only 
              for the purposes specified.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={4}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">4. Data Security</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Security Measures:</h3>
              <FeatureRow cols={3} items={[
                { title: 'Encryption' },
                { title: 'Multi-factor auth' },
                { title: 'Security audits' },
                { title: 'Access controls' },
                { title: 'Employee training' },
              ]} />
            </div>
            <p className="text-muted text-sm">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. 
              We cannot guarantee absolute security.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={5}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">5. Data Retention</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
              policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Retention Periods:</h3>
              <FeatureRow cols={2} items={[
                { title: 'Account: life + 7y' },
                { title: 'Transactions: 7y' },
                { title: 'KYC/AML: 5–7y' },
                { title: 'Analytics: 2y' },
                { title: 'Marketing: until opt-out' },
              ]} />
            </div>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={6}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">6. Your Rights</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Depending on your location, you may have certain rights regarding your personal information.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Your Rights May Include:</h3>
              <FeatureRow cols={2} items={[
                { title: 'Access' },
                { title: 'Correction' },
                { title: 'Deletion' },
                { title: 'Restriction' },
                { title: 'Portability' },
                { title: 'Objection' },
                { title: 'Withdraw consent' },
              ]} />
            </div>
            <p className="text-muted text-sm">
              To exercise these rights, please contact us using the information provided below. We will respond to 
              your request within the timeframes required by applicable law.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={7}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">7. Cookies and Tracking</h2>
          <div className="space-y-4">
            <p className="text-muted">
              We use cookies and similar tracking technologies to enhance your experience on our website and 
              analyze usage patterns.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Types of Cookies:</h3>
              <FeatureRow cols={2} items={[
                { title: 'Essential' },
                { title: 'Analytics' },
                { title: 'Preferences' },
                { title: 'Marketing' },
              ]} />
            </div>
            <p className="text-muted text-sm">
              You can control cookie settings through your browser preferences. However, disabling certain cookies 
              may affect website functionality.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={8}>
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
        </SectionWrapper>

        <SectionWrapper index={9}>
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
        </SectionWrapper>

        <SectionWrapper index={10}>
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
        </SectionWrapper>
      </PageHero>
    </PageTheme>
  )
}