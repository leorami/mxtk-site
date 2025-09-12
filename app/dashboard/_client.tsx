'use client';

import SectionWrapper from '@/components/SectionWrapper';
import { useCopy } from '@/components/copy/Copy';
import ModeTextSwap from '@/components/experience/ModeTextSwap';
import DashboardContent from '@/components/home/DashboardContent';
import PageScaffold from '@/components/layout/PageScaffold';
import Card from '@/components/ui/Card';
import AdaptButton from '@/components/dashboard/AdaptButton';
import * as React from 'react';

type Props = { initialDocId?: string };

export default function DashboardPageClient({ initialDocId = 'default' }: Props) {
  const { mode } = useCopy('dashboard');
  const modeLabel = mode === 'learn' ? 'Learn' : mode === 'build' ? 'Build' : 'Operate';

  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="dashboard"
      ink="light"
      lift="H"
      glass="soft"
      heroAlign="center"
      heroActions={
        <>
          <AdaptButton docId={initialDocId} />
          {['Overview','Learn','Build','Operate','Library'].map((t) => (
            <a key={t} href={`#${t.toLowerCase()}`}
              className="btn-primary" 
              style={{
                '--accent': 'var(--mxtk-orange)'
              } as React.CSSProperties}>
              {t}
            </a>
          ))}
        </>
      }
    >
      {/* Explainer block directly under hero — same width as other sections */}
      <SectionWrapper index={1} className="section-spacing">
        <Card tint="amber">
          <ModeTextSwap
            as="h2"
            depKey={`dashboard-adapt-title-${mode}`}
            className="text-xl md:text-2xl font-semibold mb-6 copy-fade-in"
            content="How this dashboard adapts"
          />
          <ModeTextSwap
            as="p"
            depKey={`dashboard-adapt-sub-${mode}`}
            className="leading-relaxed text-muted copy-fade-in"
            content="Choose your experience in the header—Learn, Build, or Operate—and the dashboard updates copy and suggestions. Drag, resize, or remove widgets; ask Sherpa for more."
          />
        </Card>
      </SectionWrapper>

      {/* Section rails + widgets — same width wrapper */}
      <SectionWrapper index={2} className="section-spacing">
        <Card tint="teal">
          <DashboardContent initialDocId={initialDocId} />
        </Card>
      </SectionWrapper>
    </PageScaffold>
  );
}