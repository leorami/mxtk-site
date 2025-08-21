import cn from 'classnames'
import { forwardRef } from 'react'

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn('textarea', className)}
        {...props}
      />
    )
  }
)
