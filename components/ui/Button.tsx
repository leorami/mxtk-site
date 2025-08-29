import cn from 'classnames'

type Variant = 'primary' | 'secondary' | 'ghost' | 'teal' | 'soft' | 'outline' | 'link'
type Size = 'sm' | 'md' | 'lg'

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: Variant
  size?: Size
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}) {
  const sizeCls =
    size === 'sm' ? 'px-3 py-1.5 text-xs min-h-[32px]'
    : size === 'lg' ? 'px-6 py-3 text-base min-h-[48px]'
    : 'px-4 py-2 text-sm min-h-[40px]'

  const variantCls =
    variant === 'secondary' ? 'btn-secondary'
    : variant === 'ghost' ? 'btn-ghost'
    : variant === 'teal' ? 'btn-teal'
    : variant === 'soft' ? 'btn-soft'
    : variant === 'outline' ? 'btn-outline'
    : variant === 'link' ? 'btn-link'
    : 'btn-primary'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'btn inline-flex items-center justify-center font-medium transition-transform duration-[120ms] ease-out-soft hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/35 disabled:opacity-60 disabled:cursor-not-allowed',
        sizeCls,
        variantCls,
        className
      )}
    >
      {children}
    </button>
  )
}
