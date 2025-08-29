import type { ReactNode } from 'react'

type SectionGridProps = {
  left: ReactNode
  right: ReactNode
  reverseOnDesktop?: boolean
  className?: string
}

export default function SectionGrid({ left, right, reverseOnDesktop = false, className = '' }: SectionGridProps) {
  return (
    <div className={`grid gap-8 md:grid-cols-2 ${className}`}>
      <div className={`${reverseOnDesktop ? 'md:order-2' : ''} self-center`}>{left}</div>
      <div className={`${reverseOnDesktop ? 'md:order-1' : ''} mt-8 md:mt-0`}>{right}</div>
    </div>
  )
}


