import { cookies } from 'next/headers'
import PageScaffold from '@/components/layout/PageScaffold'
import SectionWrapper from '@/components/SectionWrapper'
import Card from '@/components/ui/Card'
import DashboardContent from '@/components/home/DashboardContent'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const initialDocId = cookieStore.get('mxtk_home_id')?.value ?? 'default'

  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="home"
      ink="warm"
      lift="H"
      glass="soft"
      heroAlign="left"
      heroActions={(
        <div className="flex flex-wrap gap-2 justify-start">
          <a href="#overview" className="btn-soft">Overview</a>
          <a href="#learn" className="btn-soft">Learn</a>
          <a href="#build" className="btn-soft">Build</a>
          <a href="#operate" className="btn-soft">Operate</a>
          <a href="#library" className="btn-soft">Library</a>
        </div>
      )}
    >
      {/* Small explainer panel directly under hero */}
      <SectionWrapper index={0}>
        <Card tint="amber">
          <div className="text-sm opacity-90">
            Your Dashboard adapts as you interact. Switch experience in the header (Learn/Build/Operate), then drag, resize, or remove widgets. Ask the Sherpa for new widgets anytime.
          </div>
        </Card>
      </SectionWrapper>

      {/* Section rails + widgets */}
      <div className="mt-6">
        <DashboardContent initialDocId={initialDocId} />
      </div>
    </PageScaffold>
  )
}