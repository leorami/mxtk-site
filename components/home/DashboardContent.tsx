'use client';

import * as React from 'react';
import { useCopy } from '@/components/copy/Copy';
import type { HomeDoc, WidgetState, SectionState } from '@/lib/home/types';
import Grid from '@/components/home/Grid';
import WidgetFrame from '@/components/home/WidgetFrame';

type Props = {
  initialDocId?: string;
  initialDoc?: HomeDoc | null;
};

function api(path: string) {
  // Works at root and under /mxtk without hardcoding
  const bp = (globalThis as any).__mx_basePath || '';
  return `${bp}${path}`;
}

async function safeJson(res: Response) {
  try {
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** GET a Home doc; on 404 seed it; return final HomeDoc or null. */
async function ensureHome(docId: string, mode: 'learn'|'build'|'operate'): Promise<HomeDoc | null> {
  // Try GET
  try {
    const res = await fetch(api(`/api/ai/home/${docId}`), { cache: 'no-store' });
    if (res.ok) {
      return (await safeJson(res)) as HomeDoc | null;
    }
    // If not found, seed it
    if (res.status === 404) {
      const seed = await fetch(api('/api/ai/home/seed'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: docId, mode }),
        cache: 'no-store',
      });
      if (seed.ok) {
        return (await safeJson(seed)) as HomeDoc | null;
      }
    }
  } catch (e) {
    console.error('ensureHome failed', e);
  }
  return null;
}

/** PATCH helper for widget updates */
async function patchWidgets(docId: string, updates: Partial<WidgetState>[]) {
  try {
    await fetch(api(`/api/ai/home/${docId}`), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ widgets: updates }),
      cache: 'no-store',
    });
  } catch (e) {
    console.error('home PATCH failed', e);
  }
}

/** dispatches the guide prefill event (your GuideDrawer listens & opens) */
function prefillGuide(text: string) {
  try {
    window.dispatchEvent(new CustomEvent('mxtk:guide:prefill', { detail: { text } }));
  } catch {}
}

export default function DashboardContent({ initialDocId = 'default', initialDoc = null }: Props) {
  const { mode } = useCopy('dashboard'); // uses your site-wide experience mode
  const [doc, setDoc] = React.useState<HomeDoc | null>(initialDoc);
  const [refreshTick, setRefreshTick] = React.useState(0);

  // First load (or mode change): GET (and seed if needed)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await ensureHome(initialDocId, mode === 'ai' ? 'build' : mode);
      if (alive) setDoc(loaded);
    })();
    return () => { alive = false };
    // include refreshTick to allow manual refresh
  }, [initialDocId, mode, refreshTick]);

  // Avoid “is not iterable” – normalize sections
  const sections: SectionState[] = React.useMemo(() => {
    const arr = (doc && Array.isArray((doc as any).sections)) ? (doc!.sections as SectionState[]) : [];
    return arr;
  }, [doc]);

  // ----- Widget action handlers (wired into WidgetFrame) ---------------------
  function handleRemove(w: WidgetState) {
    if (!doc) return;
    patchWidgets(doc.id, [{ id: w.id, remove: true }]);
    // optimistically hide it locally
    setDoc(prev => prev ? { ...prev, widgets: prev.widgets.filter(x => x.id !== w.id) } : prev);
  }

  function handleRefresh(_w: WidgetState) {
    // Keep it simple: bump a tick to re-fetch the doc
    setRefreshTick(t => t + 1);
  }

  function handleInfo(w: WidgetState) {
    const title = w.title || w.type;
    prefillGuide(`Tell me more about the "${title}" widget and how to use it.`);
  }

  // Render-prop body for common widget types (minimal demo bodies)
  function renderWidget(w: WidgetState) {
    if (w.type === 'custom-note') {
      return (
        <WidgetFrame
          title={w.title ?? 'Note'}
          onRemove={() => handleRemove(w)}
          onInfo={() => handleInfo(w)}
          onRefresh={() => handleRefresh(w)}
        >
          <textarea
            className="input w-full h-full min-h-[6rem]"
            placeholder="Write a quick note…"
            defaultValue={(w as any).data?.note ?? ''}
            onChange={(e) => {
              if (!doc) return;
              const note = e.currentTarget.value;
              // light debounce
              const id = w.id;
              const t = setTimeout(() => patchWidgets(doc.id, [{ id, data: { note } }]), 400);
              // cleanup if the user keeps typing
              return () => clearTimeout(t);
            }}
          />
        </WidgetFrame>
      );
    }

    if (w.type === 'recent-answers') {
      return (
        <WidgetFrame
          title={w.title ?? 'Recent Answers'}
          onRemove={() => handleRemove(w)}
          onInfo={() => handleInfo(w)}
          onRefresh={() => handleRefresh(w)}
        >
          <div className="widget-recent-answers">
            <div className="answer-card">Answer A</div>
            <div className="answer-card">Answer B</div>
            <div className="answer-card">Answer C</div>
          </div>
        </WidgetFrame>
      );
    }

    if (w.type === 'what-next' || w.type === 'whats-next') {
      return (
        <WidgetFrame
          title={w.title ?? 'What’s Next'}
          onRemove={() => handleRemove(w)}
          onInfo={() => handleInfo(w)}
          onRefresh={() => handleRefresh(w)}
        >
          <ul className="list-disc pl-5 text-sm opacity-85">
            <li><a href="/learn">Learn the basics</a></li>
            <li><a href="/resources">Explore resources</a></li>
            <li><a href="/contact">Talk to us</a></li>
          </ul>
        </WidgetFrame>
      );
    }

    // Fallback for unknown types
    return (
      <WidgetFrame
        title={w.title ?? w.type}
        onRemove={() => handleRemove(w)}
        onInfo={() => handleInfo(w)}
        onRefresh={() => handleRefresh(w)}
      >
        <div className="p-2 text-sm opacity-70">Widget <code>{w.type}</code> isn’t wired yet.</div>
      </WidgetFrame>
    );
  }

  // --- Skeleton while loading -----------------------------------------------
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

  // --- Render real sections ---------------------------------------------------
  return (
    <div className="section-rail">
      {sections.map((sec) => {
        const widgets = doc.widgets.filter(w => w.sectionId === sec.id);
        return (
          <section id={sec.id} key={sec.id} className="scroll-mt-24 glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{sec.title}</h2>
              <button className="text-sm opacity-70 hover:opacity-100">Collapse</button>
            </header>
            <Grid doc={{ ...doc, widgets }} render={renderWidget} />
          </section>
        );
      })}
    </div>
  );
}