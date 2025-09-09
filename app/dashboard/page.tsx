"use client"
/**
 * /dashboard — replaces the old /home page.
 * Visual + behavioral parity with Landing/Contact/FAQ using the SAME primitives:
 * PageTheme, BackgroundPhoto, PageHero, SectionWrapper, Card, ModeTextSwap, useCopy.
 *
 * IMPORTANT
 * - We deliberately set BackgroundPhoto variant="home" so we reuse the exact image
 *   at /public/art/photos/home_gold.jpg without touching the BackgroundPhoto map.
 * - The grid/client logic is provided by <HomeClient/> which already handles
 *   SSR/client boundaries and empty states.
 */
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
import HomeClient from '@/components/home/HomeClient'

export default function Dashboard() {
  const { mode, pageCopy } = useCopy('dashboard')
  const contentMode = (mode === 'ai') ? 'build' : mode

  return (
    <PageTheme ink="warm" lift="H" glass="soft">
      {/* Reuse the landing photo: this resolves to /public/art/photos/home_gold.jpg */}
      <BackgroundPhoto variant="home" />

      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            {/* Hero (centered, same pattern as Contact/FAQ) */}
            <SectionWrapper index={0} className="text-center">
              <ModeTextSwap
                as="h1"
                depKey={`dashboard-hero-title-${mode}`}
                className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                content={pageCopy.heroTitle[contentMode]}
              />
              <ModeTextSwap
                as="p"
                depKey={`dashboard-hero-sub-${mode}`}
                className="text-xl text-muted max-w-3xl mx-auto"
                content={pageCopy.heroSub[contentMode]}
              />
            </SectionWrapper>

            {/* Main dashboard grid in a lifted card for visual parity */}
            <SectionWrapper index={1}>
              <Card tint="navy">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Home</h2>
                {/* This reuses the existing grid/widgets behavior */}
                <HomeClient />
              </Card>
            </SectionWrapper>

            {/* Optional descriptive sections pulled from copy, just like Contact/FAQ */}
            {pageCopy.sections?.map((sec, idx) => (
              <SectionWrapper key={`${idx}-${mode}`} index={2 + idx}>
                <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
                  <ModeTextSwap
                    as="h2"
                    depKey={`dashboard-sec-${idx}-heading-${mode}`}
                    className="text-xl md:text-2xl font-semibold mb-6"
                    content={sec.heading[contentMode]}
                  />
                  <div className="space-y-4">
                    {sec.paragraphs[contentMode].map((p, i) => (
                      <ModeTextSwap
                        key={i}
                        as="p"
                        depKey={`dashboard-sec-${idx}-p-${i}-${mode}`}
                        className="leading-relaxed text-muted"
                        content={p}
                      />
                    ))}
                  </div>
                  {sec.highlight?.[contentMode] ? (
                    <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                      <ModeTextSwap
                        as="div"
                        depKey={`dashboard-sec-${idx}-hl-${mode}`}
                        className="text-sm opacity-90"
                        content={sec.highlight[contentMode]}
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
