"use client";
import CustomNote from '@/components/home/widgets/CustomNote';
import GlossarySpotlight from '@/components/home/widgets/GlossarySpotlight';
import RecentAnswers from '@/components/home/widgets/RecentAnswers';
import ResourceList from '@/components/home/widgets/ResourceList';
import type { WidgetState } from '@/lib/home/gridTypes';

export default function WidgetFrame({ widget, onAction }: { widget: WidgetState; onAction?: (action: string, w: WidgetState) => void }) {
  const learn = () => {
    try { window.dispatchEvent(new CustomEvent('mxtk:guide:prefill', { detail: { prompt: `Tell me more about ${widget.title || widget.type}` } })) } catch { }
  };
  const refresh = () => onAction?.('refresh', widget);
  const remove = () => onAction?.('remove', widget);
  return (
    <section
      role="region"
      aria-label={widget.title || widget.type}
      data-testid="widget-frame"
      data-widget-id={widget.id}
      className="widget-frame rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-card)] shadow-sm relative"
    >
      <div className="widget-actions" role="toolbar" aria-label="Widget actions">
        {/* Pin intentionally omitted on Home */}
        <button className="icon-btn" aria-label="Refresh" onClick={refresh} data-testid="refresh-widget">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 12a9 9 0 10-3.2 6.9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <button className="icon-btn" aria-label="Learn more" onClick={learn} data-testid="learn-widget">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 10v6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="7" r="1" fill="currentColor" />
          </svg>
        </button>
        <button className="icon-btn" aria-label="Remove" onClick={remove} data-testid="remove-widget">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18M8 6l1-2h6l1 2M6 6l1 14h10l1-14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <header className="px-4 pt-4 pb-2 font-semibold text-[var(--ink-strong)] dark:text-[var(--ink-strong)]">{widget.title || widget.type}</header>
      <div className="widget-body px-4 pb-4 text-sm text-[var(--ink)] dark:text-[var(--ink)]">
        {widget.type === 'recent-answers' && <RecentAnswers />}
        {widget.type === 'glossary-spotlight' && <GlossarySpotlight />}
        {widget.type === 'custom-note' && <CustomNote widgetId={widget.id} />}
        {widget.type === 'resource-list' && <ResourceList />}
        {widget.type === 'getting-started' && (
          <div className="opacity-85">Use Sherpa or the site to add widgets to your Home.</div>
        )}
      </div>
    </section>
  );
}


