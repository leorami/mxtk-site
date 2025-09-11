'use client';

import * as React from 'react';
import PageScaffold from '@/components/layout/PageScaffold';
import SectionWrapper from '@/components/SectionWrapper';
import ModeTextSwap from '@/components/experience/ModeTextSwap';
import { useCopy } from '@/components/copy/Copy';
import DashboardContent from '@/components/home/DashboardContent';

type Props = { initialDocId?: string };

export default function DashboardPageClient({ initialDocId = 'default' }: Props) {
  const { mode } = useCopy('dashboard');

  return (
    <PageScaffold
      copyKey="dashboard"
      backgroundVariant="dashboard"
      ink="warm"
      lift="H"
      glass="soft"
      heroAlign="center"
      heroActions={
        <>
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
        <div className="glass glass--panel p-6 md:p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
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
        </div>
      </SectionWrapper>

      {/* Section rails + widgets — same width wrapper */}
      <SectionWrapper index={2} className="section-spacing">
        <div className="glass glass--panel p-6 md:p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
          <DashboardContent initialDocId={initialDocId} />
        </div>
      </SectionWrapper>
    </PageScaffold>
  );
}