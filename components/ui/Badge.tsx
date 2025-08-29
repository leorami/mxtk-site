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
      'rounded-xl border px-2 py-0.5 text-xs bg-[var(--surface-2)] border-[var(--border-soft)]',
      className
    )}>
      {children}
    </span>
  )
}
