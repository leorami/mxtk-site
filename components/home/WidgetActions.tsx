"use client";

export default function WidgetActions({ title, prompt, onAdd }: { title: string; prompt?: string; onAdd?: () => Promise<void> | void }) {
  return (
    <div className="absolute top-2 right-2 flex gap-1" role="toolbar" aria-label="Widget actions">
      <button aria-label="Add to Home" className="btn-icon" onClick={async () => { await onAdd?.(); }}>+</button>
      <button aria-label="Open Guide" className="btn-icon" onClick={() => window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt: prompt || `Tell me more about ${title}` } }))}>?</button>
    </div>
  );
}


