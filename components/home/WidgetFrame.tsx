'use client';

import { getApiPath } from '@/lib/basepath';
import * as React from 'react';

type Density = 'compact' | 'cozy';

type Props = {
  id?: string;
  docId?: string;
  data?: { density?: Density } | Record<string, unknown>;
  title?: string;
  children?: React.ReactNode;
  onRefresh?: () => void;
  onInfo?: () => void;
  onRemove?: () => void;
};

function getHomeIdFallback(): string {
  try {
    const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'default';
  } catch { return 'default'; }
}

export default function WidgetFrame({ id, docId, data, title, children, onRefresh, onInfo, onRemove }: Props) {
  const [open, setOpen] = React.useState(false);
  const [localTitle, setLocalTitle] = React.useState<string | undefined>(title);
  const [density, setDensity] = React.useState<Density>(() => (data as any)?.density === 'compact' ? 'compact' : 'cozy');
  React.useEffect(() => { setLocalTitle(title); }, [title]);

  const save = React.useCallback(async () => {
    if (!id) return;
    const homeId = docId || getHomeIdFallback();
    try {
      await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(homeId)}`), {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ widgets: [{ id, title: localTitle, data: { ...(data || {}), density } }] })
      });
    } catch { /* no-op */ }
  }, [id, docId, localTitle, density, data]);

  const bodyDensityClass = density === 'compact' ? 'space-y-2 text-sm' : 'space-y-3';

  return (
    <div className="relative h-full">
      {/* Header row: title + actions; actions marked no-drag */}
      <header className="wf-head">
        <div className="wf-title">{localTitle}</div>
        <div className="wf-actions wframe-controls widget-controls" data-nodrag aria-hidden="true">
          {onRefresh && (
            <button type="button" className="iconbtn" title="Refresh" onClick={onRefresh}>↻</button>
          )}
          <button type="button" className="iconbtn" title="Settings" onClick={() => setOpen(o => !o)} aria-haspopup="dialog" aria-expanded={open ? 'true' : 'false'}>⚙︎</button>
          {onInfo && (<button type="button" className="iconbtn" title="Info" onClick={onInfo}>i</button>)}
          {onRemove && (<button type="button" className="iconbtn" title="Remove" onClick={onRemove}>✕</button>)}
        </div>
      </header>

      <div className={`widget-body wframe-body ${bodyDensityClass}`} data-widget-body>
        {children}
      </div>

      {open && (
        <div className="absolute top-8 right-2 z-10 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card-emb)] shadow p-3 min-w-[220px]">
          <div className="field mb-2">
            <label className="label">Title</label>
            <input className="input" value={localTitle || ''} onChange={e => setLocalTitle(e.currentTarget.value)} placeholder="Widget title" />
          </div>
          <div className="field mb-3">
            <label className="label">Density</label>
            <div className="inline-flex gap-2">
              <label className="inline-flex items-center gap-1 text-sm">
                <input type="radio" name={`density-${id}`} checked={density === 'compact'} onChange={() => setDensity('compact')} />
                Compact
              </label>
              <label className="inline-flex items-center gap-1 text-sm">
                <input type="radio" name={`density-${id}`} checked={density === 'cozy'} onChange={() => setDensity('cozy')} />
                Cozy
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => { save(); setOpen(false); }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}