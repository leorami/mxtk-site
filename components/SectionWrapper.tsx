
import React from 'react'

type SectionWrapperProps = {
  children: React.ReactNode
  className?: string
  index?: number
  title?: string
  collapsed?: boolean
  onToggle?: (next: boolean) => void
}

export default function SectionWrapper({ children, className = '', index = 0, title, collapsed, onToggle }: SectionWrapperProps) {
  const showHeader = typeof collapsed === 'boolean'
  return (
    <section className={`container mx-auto px-3 md:px-4 max-w-6xl ${className} ${index === 0 ? '' : 'section-spacing'}`}>
      {showHeader && (
        <header className={collapsed ? 'flex items-center justify-between' : 'sr-only md:flex md:opacity-70 md:h-8'}>
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            className="chip inline-flex px-2 py-0.5 rounded-full border text-xs"
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
            onClick={() => onToggle && onToggle(!collapsed)}
          >
            {collapsed ? '+' : '−'}
          </button>
        </header>
      )}
      {children}
    </section>
  );
}


