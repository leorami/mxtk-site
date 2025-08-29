import cn from 'classnames'

type SectionMaskProps = {
  side?: 'top' | 'bottom'
  className?: string
}

/**
 * Organic edge mask to break rectangular section edges.
 * Renders a full-width SVG shape filled with the page surface color.
 */
export default function SectionMask({ side = 'bottom', className }: SectionMaskProps) {
  const positionClass = side === 'top' ? 'top-0 rotate-180' : 'bottom-0'
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-x-0 h-16 md:h-20 text-[color:var(--surface-page)]', positionClass, className)}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <path
        fill="currentColor"
        d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,213.3C840,203,960,149,1080,144C1200,139,1320,181,1380,202.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      />
    </svg>
  )
}


