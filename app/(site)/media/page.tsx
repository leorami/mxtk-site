import BasePathLink from '@/components/BasePathLink'
import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'

export default function MediaPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <PageHero>
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
            Media & Press
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Logos, brand guidance, and contacts for press and partners. Everything you need to cover MXTK accurately and effectively.
          </p>
        </section>
      </PageHero>

      {/* Press Kit */}
      <section className="section-amber">
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Press Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🎨</div>
              <h3 className="font-semibold mb-2">Brand Assets</h3>
              <p className="text-muted text-sm mb-4">Official logos, color palettes, and visual guidelines</p>
              <a className="btn-soft" href="docs/design-assets/mxtk_palette_light.png" target="_blank" rel="noopener noreferrer">
                Download Assets
              </a>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">📄</div>
              <h3 className="font-semibold mb-2">Logo Package</h3>
              <p className="text-muted text-sm mb-4">High-resolution MXTK logos in various formats</p>
              <a className="btn-soft" href="logo-horizontal.png" target="_blank" rel="noopener noreferrer">
                Download Logo
              </a>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">👥</div>
              <h3 className="font-semibold mb-2">Team Bios</h3>
              <p className="text-muted text-sm mb-4">Founder and team member information</p>
              <a className="btn-soft" href="#" target="_blank" rel="noopener noreferrer">
                View Bios
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Contact */}
      <section className="section-teal">
        <Card tint="teal" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg mb-6">
            Ready to cover MXTK? We're here to help with interviews, technical details, and exclusive insights.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Press Inquiries</h3>
              <a className="btn-primary" href="mailto:media@mineral-token.com">
                media@mineral-token.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Technical Questions</h3>
              <a className="btn-outline" href="mailto:tech@mineral-token.com">
                tech@mineral-token.com
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Resources */}
      <section className="section-navy">
        <Card tint="navy">
          <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Whitepaper</h3>
              <p className="text-muted text-sm mb-4">Technical documentation and methodology</p>
              <BasePathLink className="btn-link" to="whitepaper">Read Whitepaper</BasePathLink>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-muted text-sm mb-4">On-chain data and verification sources</p>
              <BasePathLink className="btn-link" to="transparency">View Transparency</BasePathLink>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Roadmap</h3>
              <p className="text-muted text-sm mb-4">Development milestones and timeline</p>
              <BasePathLink className="btn-link" to="roadmap">See Roadmap</BasePathLink>
            </div>
            <div>
              <h3 className="font-semibold mb-2">MXTK Gives</h3>
              <p className="text-muted text-sm mb-4">Nonprofit initiative and impact</p>
              <BasePathLink className="btn-link" to="elite-drop">Learn More</BasePathLink>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}