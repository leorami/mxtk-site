import cn from 'classnames'

export default function Badge({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn(
      'rounded-xl border border-brand-border bg-white/60 dark:bg-dark-surface/60 dark:border-dark-border px-2 py-0.5 text-xs',
      className
    )}>
      {children}
    </span>
  )
}
