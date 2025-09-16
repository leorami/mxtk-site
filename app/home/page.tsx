import SectionWrapper from '@/components/SectionWrapper';
import StatTile from '@/components/StatTile';
import DashboardContent from '@/components/home/DashboardContent';
import PageScaffold from '@/components/layout/PageScaffold';
import Button from '@/components/ui/Button';
import { getCurrentStage, helpers, hero } from '@/copy/home';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const stage = getCurrentStage();
  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="home"
      ink="warm"
      lift="H"
      glass="soft"
      heroAlign="center"
      heroTitle={(
        <h1 data-testid="home-hero-title" className="text-4xl md:text-6xl font-bold tracking-tight">
          {hero[stage].title}
        </h1>
      )}
      heroActions={(
        <div className="flex flex-wrap gap-3 justify-center">
          <Button href="/owners" size="sm" variant="primary">Mineral Owners</Button>
          <Button href="/transparency" size="sm" variant="outline">Trust & Transparency</Button>
        </div>
      )}
    >
      <p data-testid="home-hero-helper" className="mt-2 text-sm opacity-80">{helpers[stage].underHero}</p>
      <SectionWrapper index={1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatTile label="$33B+" value="Mineral Assets Committed" faIcon="fa-gem" iconColorClass="text-amber-600" />
          <StatTile label="1:1" value="Asset-Backed Ratio" faIcon="fa-scale-balanced" iconColorClass="text-emerald-600" />
          <StatTile label="Global" value="Mineral Network" faIcon="fa-globe" iconColorClass="text-sky-600" />
        </div>
      </SectionWrapper>
      <SectionWrapper index={2}>
        <DashboardContent />
      </SectionWrapper>
    </PageScaffold>
  );
}
