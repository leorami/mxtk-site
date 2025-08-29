'use client'

import cn from 'classnames';

type WavePage = 'home' | 'owners'
type WavePos = 'top' | 'bottom'

type Props = {
  page: WavePage;
  position: WavePos;
  height?: number;
  overlap?: number;
  className?: string;
};

export default function WaveBand({
  page,
  position,
  height = 160,
  overlap = 32,
  className = '',
}: Props) {
  const file = (tone: 'light' | 'dark') => `/art/waves/${page}/wave_${position}_${tone}.png`
  const overlapClass = position === 'top' ? ' -mt-[var(--overlap)]' : ' -mb-[var(--overlap)]'

  return (
    <div
      aria-hidden
      className={cn('relative w-full pointer-events-none select-none', className, overlapClass)}
      style={{ height: `${height}px`, '--overlap': `${overlap}px` } as React.CSSProperties}
    >
      <img
        className="absolute inset-0 block dark:hidden w-full h-full object-cover"
        src={file('light')}
        alt=""
        decoding="async"
        loading="lazy"
      />
      <img
        className="absolute inset-0 hidden dark:block w-full h-full object-cover"
        src={file('dark')}
        alt=""
        decoding="async"
        loading="lazy"
      />
    </div>
  )
}


