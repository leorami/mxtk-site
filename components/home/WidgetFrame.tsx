"use client";
import type { WidgetState } from '@/lib/home/gridTypes';

export default function WidgetFrame({ widget, onAction }: { widget: WidgetState; onAction?: (action: string, w: WidgetState) => void }){
  return (
    <section role="region" aria-label={widget.title || widget.type} data-testid="widget-frame" data-widget-id={widget.id}
      className="rounded-2xl border bg-glass/60 backdrop-blur relative">
      <div className="absolute top-2 right-2 flex gap-1">
        <button aria-label="Add" className="btn-icon" onClick={() => onAction?.('add', widget)}>＋</button>
        <button aria-label="Like/Dislike" className="btn-icon" onClick={() => onAction?.('like-toggle', widget)}>♡</button>
        <button aria-label="Info" className="btn-icon" onClick={() => onAction?.('info', widget)}>i</button>
      </div>
      <header className="px-4 pt-4 pb-2 font-medium">{widget.title || widget.type}</header>
      <div className="px-4 pb-4 text-sm opacity-80">
        Placeholder content for {widget.type}
      </div>
    </section>
  );
}


