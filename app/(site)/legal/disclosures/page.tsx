import Card from '@/components/ui/Card'

export default function DisclosuresPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Disclosures</h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Forward-looking statements are subject to risks and uncertainties. Metrics labeled as preview are indicative only
          and may change without notice.
        </p>
      </section>

      {/* Statement */}
      <section className="section-teal">
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-4">Forward-looking statements</h2>
          <p className="text-muted text-sm">
            Statements regarding planned integrations, markets, or features are not guarantees of future performance.
            Actual results may differ based on market conditions, regulatory developments, and execution risks.
          </p>
        </Card>
      </section>
    </div>
  )
}