"use client"
import BasePathLink from '@/components/BasePathLink'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function MediaPage() {
  const { mode, pageCopy } = useCopy('media')
  const mode3 = (mode === 'ai' ? 'learn' : mode) as 'learn' | 'build' | 'operate'
  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <BackgroundPhoto variant="media" />
      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            <SectionWrapper index={0} className="text-center">
              <ModeTextSwap as="h1" depKey={`media-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[mode3]} />
              <ModeTextSwap as="p" depKey={`media-hero-sub-${mode}`} className="text-xl text-muted max-w-3xl mx-auto" content={pageCopy.heroSub[mode3]} />
            </SectionWrapper>

            <SectionWrapper index={1}>
              <Card tint="amber">
                <ModeTextSwap as="h2" depKey={`media-p0-title-${mode}`} className="text-2xl font-semibold mb-6" content={pageCopy.pillars?.[0]?.title[mode3] || 'Press Kit'} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">🎨</div>
                    <h3 className="font-semibold mb-2">Brand Assets</h3>
                    <p className="text-muted text-sm mb-4">{pageCopy.pillars?.[0]?.body[mode3] || 'Official logos, color palettes, and visual guidelines'}</p>
                    <BasePathLink className="btn-soft" to="resources">
                      View Brand Assets
                    </BasePathLink>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Logo Package</h3>
                    <p className="text-muted text-sm mb-4">High-resolution MXTK logos in various formats</p>
                    <a className="btn-soft" href="/logo-horizontal.png" target="_blank" rel="noopener noreferrer">
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
            </SectionWrapper>

            <SectionWrapper index={2}>
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
            </SectionWrapper>

            <SectionWrapper index={3}>
              <Card tint="navy">
                <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Whitepaper</h3>
                    <p className="text-muted text-sm mb-4">Technical documentation and methodology</p>
                    <BasePathLink className="btn-link btn-sm" to="whitepaper">Read Whitepaper</BasePathLink>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Transparency</h3>
                    <p className="text-muted text-sm mb-4">On-chain data and verification sources</p>
                    <BasePathLink className="btn-link btn-sm" to="transparency">View Transparency</BasePathLink>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Roadmap</h3>
                    <p className="text-muted text-sm mb-4">Development milestones and timeline</p>
                    <BasePathLink className="btn-link btn-sm" to="roadmap">See Roadmap</BasePathLink>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">MXTK Gives</h3>
                    <p className="text-muted text-sm mb-4">Nonprofit initiative and impact</p>
                    <BasePathLink className="btn-link btn-sm" to="mxtk-cares">Learn More</BasePathLink>
                  </div>
                </div>
              </Card>
            </SectionWrapper>
            {pageCopy.sections?.map((sec, idx) => (
              <SectionWrapper key={`${idx}-${mode}`} index={4 + idx}>
                <Card tint={idx % 2 === 0 ? "amber" : "navy"}>
                  <ModeTextSwap
                    as="h2"
                    depKey={`media-sec-${idx}-heading-${mode}`}
                    className="text-xl md:text-2xl font-semibold mb-6"
                    content={sec.heading[mode3]}
                  />
                  <div className="space-y-4">
                    {sec.paragraphs[mode3].map((p, i) => (
                      <ModeTextSwap
                        key={i}
                        as="p"
                        depKey={`media-sec-${idx}-p-${i}-${mode}`}
                        className="leading-relaxed text-muted"
                        content={p}
                      />
                    ))}
                  </div>
                  {sec.highlight?.[mode3] ? (
                    <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                      <ModeTextSwap
                        as="div"
                        depKey={`media-sec-${idx}-hl-${mode}`}
                        className="text-sm opacity-90"
                        content={sec.highlight[mode3]}
                      />
                    </div>
                  ) : null}
                </Card>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}