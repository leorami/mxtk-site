import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import DashboardContent from '@/components/home/DashboardContent'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
import { dashboardCopy } from '@/copy/dashboard'

export default function DashboardPage() {
  // Get copy data from client component instead of server component
  const mode = 'learn' // Default mode, will be overridden by client component
  const contentMode = (mode === 'ai') ? 'build' : mode

  // Use imported copy directly
  const pageCopy = dashboardCopy

  return (
    <PageTheme ink="warm" lift="H" glass="soft">
      {/* Use the same gold background as Landing */}
      <BackgroundPhoto variant="home" />

      <PageHero>
        <div className="relative">
          <div className="space-y-0">
            {/* HERO — exact same structure as other pages */}
            <SectionWrapper index={0} className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
                {pageCopy.heroTitle[contentMode]}
              </h1>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                {pageCopy.heroSub[contentMode]}
              </p>
            </SectionWrapper>

            {/* "How this dashboard adapts" — same Card pattern */}
            <SectionWrapper index={1}>
              <Card tint="amber">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                  {pageCopy.adaptTitle[contentMode]}
                </h2>
                <p className="text-muted">
                  {pageCopy.adaptSub[contentMode]}
                </p>
              </Card>
            </SectionWrapper>

            {/* Client-side rendered dashboard content */}
            <DashboardContent initialDocId="default" />
          </div>
        </div>
      </PageHero>
    </PageTheme>
  )
}