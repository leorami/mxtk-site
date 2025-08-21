import Card from '@/components/ui/Card'

export default function PrivacyPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Privacy</h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          We use privacy-friendly analytics and limit data collection to what is necessary to provide this site. Cookies are
          not set until you consent. Contact us to request access or deletion of any personal information we may hold.
        </p>
      </section>

      {/* Policy summary */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-4">Data Policy</h2>
          <p className="text-muted text-sm">
            We collect the minimum data necessary to operate this website and provide requested services. Metrics labeled as
            preview are indicative only and may change. You can request access or deletion of your personal data at any time.
          </p>
        </Card>
      </section>
    </div>
  )
}