import SectionWrapper from '@/components/SectionWrapper';
import StatTile from '@/components/StatTile';
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
      <SectionWrapper index={1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatTile label="$33B+" value="Mineral Assets Committed" faIcon="fa-gem" iconColorClass="text-amber-600" />
          <StatTile label="1:1" value="Asset-Backed Ratio" faIcon="fa-scale-balanced" iconColorClass="text-emerald-600" />
          <StatTile label="Global" value="Mineral Network" faIcon="fa-globe" iconColorClass="text-sky-600" />
        </div>
      </SectionWrapper>
      {/* Main dashboard sections (Overview, Learn, Build, Operate, Library) */}
      <SectionWrapper index={2}>
        <DashboardContent />
      </SectionWrapper>
    </PageScaffold>
  );
}