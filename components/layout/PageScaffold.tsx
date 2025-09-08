'use client'
import { ReactNode } from 'react';

export type SectionAction = { id: string; label: string; icon?: ReactNode; onClick?: () => void; href?: string; ariaLabel?: string };
export type SectionSpec = { id: string; title?: string; description?: string; actions?: SectionAction[]; children: ReactNode };

export default function PageScaffold({
    title,
    subtitle,
    description,
    sections,
    backgroundClass,
}: {
    title: string;
    subtitle?: string;
    description?: string;
    sections: SectionSpec[];
    backgroundClass?: string; // e.g., 'mineral-sheen'
}) {
    return (
        <div className={`page-scaffold ${backgroundClass || ''}`} data-testid="page-scaffold">
            <header className="page-hero">
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
                {description && <p className="page-desc">{description}</p>}
            </header>
            <main className="page-main" aria-label={title}>
                {sections.map((s) => (
                    <section key={s.id} className="section-card" role="region" aria-label={s.title || s.id}>
                        {(s.title || s.actions?.length) && (
                            <div className="section-header">
                                <div className="section-title">
                                    {s.title && <h2>{s.title}</h2>}
                                    {s.description && <p className="section-sub">{s.description}</p>}
                                </div>
                                {s.actions?.length ? (
                                    <div className="section-actions" role="toolbar">
                                        {s.actions.map((a) => (
                                            a.href ? (
                                                <a key={a.id} href={a.href} aria-label={a.ariaLabel || a.label} className="icon-btn">{a.icon || a.label}</a>
                                            ) : (
                                                <button key={a.id} type="button" aria-label={a.ariaLabel || a.label} className="icon-btn" onClick={a.onClick}>{a.icon || a.label}</button>
                                            )
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <div className="section-body">{s.children}</div>
                    </section>
                ))}
            </main>
        </div>
    )
}


