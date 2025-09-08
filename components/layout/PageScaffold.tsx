'use client'
import clsx from 'clsx'
import React from 'react'

interface Section { id: string; title?: string; description?: string; actions?: React.ReactNode; children: React.ReactNode }
export default function PageScaffold({
  title,
  subtitle,
  description,
  sections = [],
  backgroundClass,
  className
}: {
  title?: string;
  subtitle?: string;
  description?: string;
  sections?: Section[];
  backgroundClass?: string; // e.g., 'mxtk-bg-mineral' | 'mxtk-bg-diamond'
  className?: string;
}) {
  return (
    <div className={clsx('page-scaffold min-h-screen', backgroundClass, className)} data-testid="page-scaffold">
      <header className="scaffold-hero container">
        {title && <h1 className="scaffold-title">{title}</h1>}
        {subtitle && <p className="scaffold-subtitle">{subtitle}</p>}
        {description && <p className="scaffold-description">{description}</p>}
      </header>
      <main className="scaffold-main container" role="main">
        {sections.map((s) => (
          <section key={s.id} className="scaffold-section" aria-labelledby={`${s.id}-title`}>
            {(s.title || s.actions) && (
              <div className="section-header">
                <div className="section-title">
                  {s.title && <h2 id={`${s.id}-title`}>{s.title}</h2>}
                  {s.description && <p className="section-desc">{s.description}</p>}
                </div>
                <div className="section-actions">{s.actions}</div>
              </div>
            )}
            <div className="section-body">{s.children}</div>
          </section>
        ))}
      </main>
    </div>
  )
}


