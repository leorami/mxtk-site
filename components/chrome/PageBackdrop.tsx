'use client'

import { usePublicPath } from '@/lib/routing/getPublicPathClient';
import cn from 'classnames';

type Props = { route: 'home' | 'owners'; className?: string }

export default function PageBackdrop({ route, className }: Props) {
  const topLight    = usePublicPath(`art/waves/${route}/wave_top_light.png`)
  const topDark     = usePublicPath(`art/waves/${route}/wave_top_dark.png`)
  const bottomLight = usePublicPath(`art/waves/${route}/wave_bottom_light.png`)
  const bottomDark  = usePublicPath(`art/waves/${route}/wave_bottom_dark.png`)

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[PageBackdrop]', { topLight, topDark, bottomLight, bottomDark })
  }

  return (
    <>
      {/* TOP */}
      <img
        src={topLight}
        alt="" role="presentation" aria-hidden
        className={cn(
          'brand-bg top-0 block dark:hidden',
          className
        )}
        loading="lazy"
      />
      <img
        src={topDark}
        alt="" role="presentation" aria-hidden
        className={cn(
          'brand-bg top-0 hidden dark:block',
          className
        )}
        loading="lazy"
      />
      {/* BOTTOM */}
      <img
        src={bottomLight}
        alt="" role="presentation" aria-hidden
        className="brand-bg bottom-0 block dark:hidden"
        loading="lazy"
      />
      <img
        src={bottomDark}
        alt="" role="presentation" aria-hidden
        className="brand-bg bottom-0 hidden dark:block"
        loading="lazy"
      />
    </>
  )
}


