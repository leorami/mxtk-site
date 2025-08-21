import cn from 'classnames'
import { forwardRef } from 'react'

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn('select', className)} {...props}>
        {children}
      </select>
    )
  }
)
