import * as React from "react";
export default function WidgetFrame({
  title, children, onRefresh, onSettings,
}: { title?: string; children: React.ReactNode; onRefresh?: ()=>void; onSettings?: ()=>void }) {
  return (
    <div className="wframe" data-testid="wframe">
      <div className="wframe-controls" aria-hidden="true">
        <button className="iconbtn" title="Refresh" onClick={onRefresh}>↻</button>
        <button className="iconbtn" title="Settings" onClick={onSettings}>⚙︎</button>
        <button className="iconbtn" title="Pin">📌</button>
      </div>
      {title ? <div className="w-title text-sm font-semibold mb-2">{toTitleCase(title)}</div> : null}
      <div className="wframe-body" data-widget-body>{children}</div>
    </div>
  );
}
function toTitleCase(s?: string){ if(!s) return ""; return s.replace(/\w\S*/g,t=>t[0].toUpperCase()+t.slice(1).toLowerCase()); }