import SectionWrapper from '@/components/SectionWrapper';
import DashboardContent from '@/components/home/DashboardContent';
import PageScaffold from '@/components/layout/PageScaffold';
import Link from 'next/link';

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
          <Link href="/resources" className="btn-soft">Explore resources</Link>
          <Link href="/institutions" className="btn-outline">For institutions</Link>
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