'use client';

import * as React from 'react';

type Props = {
  title?: string;
  children?: React.ReactNode;
  onRefresh?: () => void;
  onInfo?: () => void;
  onRemove?: () => void;
};

export default function WidgetFrame({ title, children, onRefresh, onInfo, onRemove }: Props) {
  return (
    <div className="relative h-full">
      {/** Controls: only visible when html.guide-open (CSS handles this) */}
      <div className="wframe-controls widget-controls" aria-hidden="true">
        {onRefresh && (
          <button type="button" className="iconbtn" title="Refresh" onClick={onRefresh}>
            ↻
          </button>
        )}
        {onInfo && (
          <button type="button" className="iconbtn" title="Info" onClick={onInfo}>
            i
          </button>
        )}
        {onRemove && (
          <button type="button" className="iconbtn" title="Remove" onClick={onRemove}>
            ✕
          </button>
        )}
      </div>

      {title ? (
        <div className="text-sm font-semibold mb-2 opacity-80">{title}</div>
      ) : null}

      <div className="widget-body" data-widget-body>
        {children}
      </div>
    </div>
  );
}