import PageScaffold from '@/components/layout/PageScaffold';
import SectionWrapper from '@/components/SectionWrapper';
import DashboardContent from '@/components/home/DashboardContent';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="home"
      ink="warm"
      lift="H"
      glass="soft"
      heroAlign="center"
      heroActions={(
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/resources" className="btn-soft">Explore resources</a>
          <a href="/institutions" className="btn-outline">For institutions</a>
        </div>
      )}
    >
      {/* Main dashboard sections (Overview, Learn, Build, Operate, Library) */}
      <SectionWrapper index={1}>
        <DashboardContent />
      </SectionWrapper>
    </PageScaffold>
  );
}