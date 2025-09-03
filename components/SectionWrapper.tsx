
import React from 'react'

type SectionWrapperProps = {
  children: React.ReactNode
  className?: string
  index?: number
}

export default function SectionWrapper({ children, className = '', index = 0 }: SectionWrapperProps) {
  return (
    <section className={`container mx-auto px-4 max-w-5xl ${className} ${index === 0 ? '' : 'section-spacing'}`}>
      {children}
    </section>
  );
}


