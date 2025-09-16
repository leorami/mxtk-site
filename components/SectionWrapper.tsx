
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
    <section className={`container mx-auto px-[var(--gutter-sm)] sm:px-6 max-w-6xl ${className} ${index === 0 ? '' : 'section-spacing'} mb-3`}>        
      {showHeader && (
        <header className={collapsed ? 'relative mb-3' : 'sr-only'}>
          <h2 className="text-xl font-semibold pr-10">{title}</h2>
          <button
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
            onClick={() => onToggle && onToggle(!collapsed)}
            className="absolute right-0 top-0 inline-flex items-center justify-center rounded-full px-2 h-6 text-sm bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20"
          >–</button>
        </header>
      )}
      {children}
    </section>
  );
}


