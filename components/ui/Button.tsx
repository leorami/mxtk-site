import clsx from 'clsx'
import Link from 'next/link'
import type React from 'react'

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
  outline: 'border bg-amber-500 text-white hover:bg-white/10 focus:ring-2 focus:ring-white/40',
  ghost: 'text-white hover:bg-white/10 focus:ring-2 focus:ring-white/40',
  // Maintain backward-compatible variants
  secondary: 'btn-secondary',
  teal: 'btn-teal',
  link: 'btn-link',
}

type BaseProps = {
  size?: Size
  variant?: Variant
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

type AnchorButtonProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

type NativeButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined
}

export type Props = AnchorButtonProps | NativeButtonProps

export default function Button({ href, size = 'sm', variant = 'primary', className, children, style, ...rest }: Props) {
  const classes = clsx(
    'btn-base',
    sizes[size],
    variants[variant],
    className
  )
  if (href) {
    const linkProps = rest as AnchorButtonProps
    return (
      <Link href={href} className={classes} style={style} {...linkProps}>
        {children}
      </Link>
    )
  }
  const btnProps = rest as NativeButtonProps
  return (
    <button className={classes} style={style} {...btnProps}>
      {children}
    </button>
  )
}
