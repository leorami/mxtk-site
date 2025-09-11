'use client';

import * as React from 'react';
import PageScaffold from '@/components/layout/PageScaffold';
import SectionWrapper from '@/components/SectionWrapper';
import ModeTextSwap from '@/components/experience/ModeTextSwap';
import { useCopy } from '@/components/copy/Copy';
import DashboardContent from '@/components/home/DashboardContent';

type Props = { initialDocId?: string };

export default function DashboardPageClient({ initialDocId = 'default' }: Props) {
  // PageScaffold drives hero via copyKey="dashboard"
  // Hero actions: anchor chips to jump to sections (no routing/basePath changes)
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
        <div className="flex flex-wrap gap-3 justify-center">
          {['Overview','Learn','Build','Operate','Library'].map((t) => (
            <a key={t} href={`#${t.toLowerCase()}`} className="btn btn--chip">
              {t}
            </a>
          ))}
        </div>
      }
    >
      {/* Small explainer block directly under the hero */}
      <SectionWrapper index={1}>
        <div className="glass glass--panel p-4 md:p-6 rounded-2xl">
          <ModeTextSwap
            as="h3"
            depKey={`dashboard-adapt-title-${mode}`}
            className="text-xl md:text-2xl font-semibold mb-2"
            content="How this dashboard adapts"
          />
          <ModeTextSwap
            as="p"
            depKey={`dashboard-adapt-sub-${mode}`}
            className="text-muted"
            content="Choose your experience in the header—Learn, Build, or Operate—and the dashboard updates copy and suggestions. Drag, resize, or remove widgets; ask Sherpa for more."
          />
        </div>
      </SectionWrapper>

      {/* All section rails + widgets */}
      <div className="mt-6">
        <DashboardContent initialDocId={initialDocId} />
      </div>
    </PageScaffold>
  );
}
