// app/dashboard/page.tsx
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import DashboardContent from '@/components/home/DashboardContent'
import PageScaffold from '@/components/layout/PageScaffold'
import SectionWrapper from '@/components/SectionWrapper'
import Card from '@/components/ui/Card'
import AdaptButton from '@/components/dashboard/AdaptButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="dashboard"
      heroAlign="center"
      ink="light"
      lift="H"
      glass="soft"
      heroActions={
        <>
          <AdaptButton docId="default" />
          {['Overview','Learn','Build','Operate','Library'].map(k => (
            <a key={k} href={`#${k.toLowerCase()}`}
              className="btn-primary" 
              style={{
                '--accent': 'var(--mxtk-orange)'
              } as React.CSSProperties}>
              {k}
            </a>
          ))}
        </>
      }
    >
      {/* Intro card — width matches other sections */}
      <SectionWrapper index={1} className="section-spacing">
        <Card tint="amber">
          <ModeTextSwap
            as="h2"
            depKey="dashboard-adapt-title"
            className="text-xl md:text-2xl font-semibold mb-6 copy-fade-in"
            content="How this dashboard adapts"
          />
          <ModeTextSwap
            as="p"
            depKey="dashboard-adapt-sub"
            className="leading-relaxed text-muted copy-fade-in"
            content="Choose your experience in the header—Learn, Build, or Operate—and the dashboard updates copy and suggestions. Drag, resize, or remove widgets; ask Sherpa for more."
          />
        </Card>
      </SectionWrapper>

      {/* The actual dashboard sections/grids */}
      <SectionWrapper index={2} className="section-spacing">
        <Card tint="teal">
          <DashboardContent initialDocId="default" />
        </Card>
      </SectionWrapper>
    </PageScaffold>
  )
}