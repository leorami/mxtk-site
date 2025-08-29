import cn from 'classnames'

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
        'glass p-6 md:p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]',
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
