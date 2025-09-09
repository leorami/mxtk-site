// components/home/Section.tsx
"use client"

import clsx from 'clsx'
import * as React from 'react'

export default function Section({
    title,
    collapsed = false,
    onToggle,
    children,
}: {
    title: string
    collapsed?: boolean
    onToggle?: (next: boolean) => void
    children?: React.ReactNode
}) {
    const [isCollapsed, setCollapsed] = React.useState(collapsed)
    React.useEffect(() => setCollapsed(collapsed), [collapsed])

    const toggle = () => {
        const next = !isCollapsed
        setCollapsed(next)
        onToggle?.(next)
    }

    return (
        <section className="sc-section">
            <header className="sc-section-head">
                <h2 className="sc-section-title">{title}</h2>
                <button className="sc-section-toggle" type="button" onClick={toggle} aria-expanded={!isCollapsed}>
                    {isCollapsed ? 'Expand' : 'Collapse'}
                </button>
            </header>
            <div className={clsx('sc-section-body', isCollapsed && 'is-collapsed')}>
                {children}
            </div>
        </section>
    )
}
