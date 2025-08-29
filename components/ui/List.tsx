import React from 'react';
import LogoGlyph from './LogoGlyph';

export function BulletList({ children }: React.PropsWithChildren) {
  return <div className="space-y-3">{children}</div>;
}

export function BulletItem({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="group focus-within:-translate-y-0.5 hover:-translate-y-0.5 transition-transform duration-300">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-5 w-5 rounded-full ring-1 ring-[var(--accent)]/35 bg-[var(--accent)]/14 shrink-0 items-center justify-center mt-0.5 transition-all duration-300 group-hover:ring-[var(--accent)]/60 group-hover:shadow-[0_6px_16px_rgba(0,0,0,.12)] group-hover:scale-[1.03] group-focus-within:ring-[var(--accent)]/60">
          <LogoGlyph size={12} className="opacity-80 transition-transform duration-300 group-hover:-rotate-6 group-focus-within:-rotate-6" />
        </span>
        <div>
          <div className="font-medium" style={{ color: 'var(--ink-strong)' }}>{title}</div>
          {children ? <div className="text-sm" style={{ color: 'var(--ink)' }}>{children}</div> : null}
        </div>
      </div>
    </div>
  );
}


