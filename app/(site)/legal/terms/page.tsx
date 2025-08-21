import Card from '@/components/ui/Card'

export default function TermsPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Terms</h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          This site is provided "as is" for informational purposes and does not constitute an offer to sell or a
          solicitation to buy any security or financial instrument.
        </p>
      </section>

      {/* Terms summary */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-4">Use of Site</h2>
          <p className="text-muted text-sm">
            Participation in any program may require additional agreements and KYC/AML screening. We may update these terms
            from time to time. Continued use of the site constitutes acceptance of revised terms.
          </p>
        </Card>
      </section>
    </div>
  )
}