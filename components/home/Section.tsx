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
            <header className={clsx('relative mb-3')}>
                <h2 className={clsx('text-xl font-semibold pr-10', !isCollapsed && 'sr-only')}>{title}</h2>
                <button
                    aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                    aria-expanded={!isCollapsed}
                    onClick={toggle}
                    className="absolute right-0 top-0 inline-flex items-center justify-center rounded-full px-2 h-6 text-sm bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20"
                    type="button"
                >–</button>
            </header>
            <div className={clsx('sc-section-body', isCollapsed && 'is-collapsed')}>
                {children}
            </div>
        </section>
    )
}
