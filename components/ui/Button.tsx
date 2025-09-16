import clsx from 'clsx'
import Link from 'next/link'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'primary' | 'soft' | 'outline' | 'ghost' | 'secondary' | 'teal' | 'link'

const sizes: Record<Size, string> = {
  sm: 'h-11 px-4 text-base',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-lg',
}

const variants: Record<Variant, string> = {
  primary: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-2 focus:ring-amber-400',
  soft: 'bg-white/10 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/40',
  outline: 'border border-white/40 text-white hover:bg-white/10 focus:ring-2 focus:ring-white/40',
  ghost: 'text-white hover:bg-white/10 focus:ring-2 focus:ring-white/40',
  // Maintain backward-compatible variants
  secondary: 'btn-secondary',
  teal: 'btn-teal',
  link: 'btn-link',
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  size?: Size
  variant?: Variant
}

export default function Button({ href, size = 'sm', variant = 'primary', className, children, ...rest }: Props) {
  const classes = clsx(
    'inline-flex items-center justify-center rounded-xl font-semibold no-underline focus:outline-none transition',
    'ring-offset-1 focus-visible:outline-none focus-visible:ring',
    sizes[size],
    variants[variant],
    className
  )
  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
