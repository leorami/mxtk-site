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
    <div className="mxtk-bg-mineral">
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
              <a key={t} href={`#${t.toLowerCase()}`} className="btn btn--pill px-4 py-2 rounded-xl shadow-sm">
                {t}
              </a>
            ))}
          </div>
        }
      >
        {/* Explainer block directly under hero — same width as other sections */}
        <SectionWrapper index={1}>
          <div className="glass glass--panel p-5 md:p-6 rounded-2xl">
            <ModeTextSwap
              as="h3"
              depKey={`dashboard-adapt-title-${mode}`}
              className="text-xl md:text-2xl font-semibold mb-2"
              content="How this dashboard adapts"
            />
            <ModeTextSwap
              as="p"
              depKey={`dashboard-adapt-sub-${mode}`}
              className="text-base opacity-90"
              content="Choose your experience in the header—Learn, Build, or Operate—and the dashboard updates copy and suggestions. Drag, resize, or remove widgets; ask Sherpa for more."
            />
          </div>
        </SectionWrapper>

        {/* Section rails + widgets — same width wrapper */}
        <SectionWrapper index={2} className="mt-6">
          <DashboardContent initialDocId={initialDocId} />
        </SectionWrapper>
      </PageScaffold>
    </div>
  );
}