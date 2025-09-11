'use client';

import type { HomeDoc, SectionState } from '@/lib/home/types';
import * as React from 'react';
import Grid from './Grid';

function api(path: string) {
  // Works with any base path; middleware handles prefix
  return path;
}

type Props = {
  initialDocId?: string;
  initialDoc?: HomeDoc | null;
};

export default function DashboardContent({ initialDocId = 'default', initialDoc = null }: Props) {
  const [doc, setDoc] = React.useState<HomeDoc | null>(initialDoc);

  // GET → if 404, seed → GET again
  React.useEffect(() => {
    let alive = true;
    (async () => {
      async function fetchDoc() {
        const res = await fetch(api(`/api/ai/home/${initialDocId}`), { cache: 'no-store' });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('home-get-failed');
        return (await res.json()) as HomeDoc;
      }

      let next = await fetchDoc();
      if (!next) {
        const seedRes = await fetch(api(`/api/ai/home/seed`), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: initialDocId, mode: 'learn' }),
        });
        if (!seedRes.ok) throw new Error('home-seed-failed');
        next = (await seedRes.json()) as HomeDoc;
      }
      if (alive) setDoc(next);
    })().catch(console.error);
    return () => { alive = false; };
  }, [initialDocId]);

  const sections: SectionState[] = React.useMemo(
    () => (Array.isArray(doc?.sections) ? (doc!.sections as SectionState[]) : []),
    [doc]
  );

  // Skeleton rails while loading
  if (!doc) {
    return (
      <div className="section-rail">
        {['Overview','Learn','Build','Operate','Library'].map(t => (
          <section key={t} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold opacity-70">{t}</h2>
            </header>
            <div className="h-16 rounded-lg opacity-40" />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="section-rail">
      {sections.sort((a,b) => (a.order ?? 0) - (b.order ?? 0)).map((sec) => {
        const widgets = doc.widgets.filter(w => w.sectionId === sec.id);
        return (
          <section id={sec.title.toLowerCase()} key={sec.id} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{sec.title}</h2>
              <button className="text-sm opacity-70 hover:opacity-100">Collapse</button>
            </header>
            <div className="section-grid">
              <Grid doc={{ ...doc, widgets }} />
            </div>
          </section>
        );
      })}
    </div>
  );
}