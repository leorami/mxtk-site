import Card from '@/components/ui/Card'
import Link from 'next/link'

// Get the base path from environment or detect from window location
function getBasePath(): string {
  if (typeof window !== 'undefined') {
    // Check if we're running under /mxtk path
    if (window.location.pathname.startsWith('/mxtk')) {
      return '/mxtk'
    }
  }
  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_ASSET_PREFIX || ''
}

export default function EliteDropPage() {
  const basePath = getBasePath()

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          MXTK Gives
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto">
          Up to $10M (today's dollars) in MXTK to 100 nonprofits—hold, learn to leverage, share outcomes.
        </p>
      </section>

      <section className="section-amber">
        <Card tint="amber" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold mb-2">1</div>
              <h3 className="font-semibold mb-2">Nominate</h3>
              <p className="text-muted text-sm">Submit nonprofit candidates for consideration</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">2</div>
              <h3 className="font-semibold mb-2">Vote</h3>
              <p className="text-muted text-sm">Community selects the top 100 organizations</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">3</div>
              <h3 className="font-semibold mb-2">Distribute</h3>
              <p className="text-muted text-sm">MXTK tokens distributed to selected nonprofits</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="section-teal">
        <Card tint="teal" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get involved</h2>
          <p className="text-lg mb-6">
            Help us identify and support nonprofits that can make the most impact with MXTK tokens.
          </p>
          <Link href={`${basePath}/elite-drop/nominate`} className="btn-primary">
            Nominate a nonprofit
          </Link>
        </Card>
      </section>

      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-4">Selection criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Impact potential</h3>
              <p className="text-muted text-sm">Organizations with clear, measurable outcomes</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-muted text-sm">Open about their operations and financials</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-muted text-sm">Willing to explore new funding mechanisms</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Sustainability</h3>
              <p className="text-muted text-sm">Long-term vision and operational stability</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}