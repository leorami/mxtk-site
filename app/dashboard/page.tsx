// app/dashboard/page.tsx
import PageScaffold from '@/components/layout/PageScaffold'
import SectionWrapper from '@/components/SectionWrapper'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import DashboardContent from '@/components/home/DashboardContent'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="dashboard"
      heroAlign="center"
      ink="warm"
      lift="H"
      glass="soft"
      heroActions={
        <div className="flex flex-wrap gap-3 justify-center">
          {['Overview','Learn','Build','Operate','Library'].map(k => (
            <a key={k} href={`#${k.toLowerCase()}`}
               className="btn btn--pill px-4 py-2 rounded-xl shadow-sm">
              {k}
            </a>
          ))}
        </div>
      }
    >
      {/* Intro card — width matches other sections */}
      <SectionWrapper index={1}>
        <div className="glass glass--panel rounded-2xl p-5 md:p-6">
          <ModeTextSwap
            as="h3"
            depKey="dashboard-adapt-title"
            className="text-xl md:text-2xl font-semibold mb-2"
            content="How this dashboard adapts"
          />
          <ModeTextSwap
            as="p"
            depKey="dashboard-adapt-sub"
            className="text-base opacity-90"
            content="Choose your experience in the header—Learn, Build, or Operate—and the dashboard updates copy and suggestions. Drag, resize, or remove widgets; ask Sherpa for more."
          />
        </div>
      </SectionWrapper>

      {/* The actual dashboard sections/grids */}
      <SectionWrapper index={2} className="mt-6">
        <DashboardContent initialDocId="default" />
      </SectionWrapper>
    </PageScaffold>
  )
}