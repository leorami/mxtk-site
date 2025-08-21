import cn from 'classnames'

export function Label({ className, children, htmlFor }:{
  className?: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return <label htmlFor={htmlFor} className={cn('label', className)}>{children}</label>
}
