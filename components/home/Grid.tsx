"use client";
import type { HomeDoc, WidgetState } from '@/lib/home/gridTypes';
import WidgetFrame from '@/components/home/WidgetFrame';

export default function Grid({ doc, onAction }: { doc: HomeDoc; onAction?: (action: string, w: WidgetState) => void }){
  return (
    <div data-testid="home-grid" className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}
    >
      {doc.widgets.map(w => (
        <div
          key={w.id}
          data-widget-id={w.id}
          className="min-w-0"
          style={{
            gridColumn: `${w.pos.x + 1} / span ${w.size.w}`,
            gridRow: `auto / span ${w.size.h}`,
          }}
        >
          <WidgetFrame widget={w} onAction={onAction} />
        </div>
      ))}
      {doc.widgets.length === 0 && (
        <div className="col-span-12 rounded-2xl border p-6 text-center text-sm opacity-70">Your Home is empty. Use Sherpa to add a starter widget.</div>
      )}
      <style jsx>{`
        @media (max-width: 1024px) { div[data-testid="home-grid"]{ grid-template-columns: repeat(6, minmax(0, 1fr)); } }
        @media (max-width: 640px)  { div[data-testid="home-grid"]{ grid-template-columns: repeat(1, minmax(0, 1fr)); } }
      `}</style>
    </div>
  );
}


