import cn from 'classnames';
import React from 'react';

export default function Card({
  children,
  className,
  embedded = false,
  interactive = false,
  tint, // 'teal' | 'amber' | 'navy' | undefined
}: {
  children: React.ReactNode
  className?: string
  embedded?: boolean
  interactive?: boolean
  tint?: 'teal' | 'amber' | 'navy'
}) {
  return (
    <div
      className={cn(
        'glass glass--panel px-4 py-3 md:px-5 md:py-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]',
        embedded && 'glass-embedded',
        interactive && 'hover-lift',
        tint === 'teal' && 'section section-teal',
        tint === 'amber' && 'section section-amber',
        tint === 'navy' && 'section section-navy',
        className
      )}
    >
      {children}
    </div>
  )
}
