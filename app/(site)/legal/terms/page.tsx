"use client"
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'

export default function TermsPage() {
  const { mode, pageCopy } = useCopy('terms')
  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{pageCopy.heroTitle[mode]}</h1>
          <p className="text-xl max-w-3xl mx-auto">{pageCopy.heroSub[mode]}</p>
        </SectionWrapper>

        <SectionWrapper index={1}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">1. Acceptance of Terms</h2>
          <p className="text-muted mb-4">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <p className="text-muted text-sm">
            These terms may be updated from time to time. Continued use of the site constitutes acceptance of revised terms.
          </p>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={2}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">2. Use of Site</h2>
          <div className="space-y-4">
            <p className="text-muted">
              This site is provided "as is" for informational purposes and does not constitute an offer to sell or a
              solicitation to buy any security or financial instrument.
            </p>
            <p className="text-muted">
              You may use this site for lawful purposes only. You agree not to use the site in any way that violates any 
              applicable federal, state, local, or international law or regulation.
            </p>
            <p className="text-muted">
              Participation in any program may require additional agreements and KYC/AML screening.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={3}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">3. Investment Risks</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Cryptocurrency investments involve substantial risk and are not suitable for all investors. The value of 
              cryptocurrencies can go down as well as up, and you may lose some or all of your investment.
            </p>
            <p className="text-muted">
              Past performance does not guarantee future results. You should carefully consider your investment objectives, 
              risks, charges, and expenses before investing.
            </p>
            <p className="text-muted">
              Mineral Token (MXTK) is backed by mineral assets, but the value of these assets can fluctuate based on 
              market conditions, geological factors, and regulatory changes.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={4}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">4. Intellectual Property</h2>
          <div className="space-y-4">
            <p className="text-muted">
              All content on this website, including but not limited to text, graphics, logos, images, and software, 
              is the property of Mineral Token or its content suppliers and is protected by copyright laws.
            </p>
            <p className="text-muted">
              You may not reproduce, distribute, modify, or create derivative works from any content on this site 
              without our prior written consent.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={5}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">5. Privacy and Data</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the site, 
              to understand our practices regarding the collection and use of your information.
            </p>
            <p className="text-muted">
              We may collect and process personal data in accordance with applicable data protection laws and our 
              Privacy Policy.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={6}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">6. Disclaimers</h2>
          <div className="space-y-4">
            <p className="text-muted">
              The information provided on this website is for general informational purposes only and should not be 
              considered as financial, investment, legal, or tax advice.
            </p>
            <p className="text-muted">
              We make no representations or warranties about the accuracy, completeness, or reliability of any information 
              on this site.
            </p>
            <p className="text-muted">
              We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, 
              fitness for a particular purpose, and non-infringement.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={7}>
          <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">7. Limitation of Liability</h2>
          <div className="space-y-4">
            <p className="text-muted">
              In no event shall Mineral Token be liable for any direct, indirect, incidental, special, consequential, 
              or punitive damages arising out of or relating to your use of this site.
            </p>
            <p className="text-muted">
              Our total liability to you for any claims arising from your use of this site shall not exceed the amount 
              you paid, if any, for accessing the site.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={8}>
          <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">8. Governing Law</h2>
          <div className="space-y-4">
            <p className="text-muted">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
              Mineral Token operates, without regard to its conflict of law provisions.
            </p>
            <p className="text-muted">
              Any disputes arising from these terms or your use of the site shall be resolved through binding arbitration 
              in accordance with the rules of the relevant arbitration association.
            </p>
          </div>
        </Card>
        </SectionWrapper>

        <SectionWrapper index={9}>
          <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">9. Contact Information</h2>
          <p className="text-muted mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@mineral-token.com" className="text-accent hover:underline">
                legal@mineral-token.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> Mineral Token Legal Department
            </p>
          </div>
        </Card>
        </SectionWrapper>
        {pageCopy.sections?.map((sec, idx) => (
          <section key={`${idx}-${mode}`} className="mt-10">
            <div className="glass glass--panel p-6 md:p-8 rounded-xl copy-swap">
              <h2 className="text-xl md:text-2xl font-semibold h-on-gradient">{sec.heading[mode]}</h2>
              <div className="mt-4 space-y-4 sub-on-gradient">
                {sec.paragraphs[mode].map((p, i) => (
                  <p key={i} className="leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </PageHero>
    </PageTheme>
  )
}