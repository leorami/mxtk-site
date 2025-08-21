import cn from 'classnames'

type Variant = 'primary' | 'secondary' | 'ghost' | 'teal'
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
    size === 'sm' ? 'px-3 py-1.5 text-xs'
    : size === 'lg' ? 'px-5 py-3 text-base'
    : 'px-4 py-2 text-sm'

  const variantCls =
    variant === 'secondary' ? 'btn-secondary'
    : variant === 'ghost' ? 'btn-ghost'
    : variant === 'teal' ? 'btn-teal'
    : 'btn-primary'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn('btn', sizeCls, variantCls, disabled && 'opacity-60', className)}
    >
      {children}
    </button>
  )
}
