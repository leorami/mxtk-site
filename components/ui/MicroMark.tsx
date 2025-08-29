'use client'

import { usePublicPath } from '@/lib/routing/getPublicPathClient';

export default function MicroMark({ size = 16, className = '' }:{
  size?: number; className?: string;
}) {
  const src = usePublicPath(`art/mxtk_micro_mark_${Math.max(12, Math.min(24, size))}.svg`)
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      role="presentation"
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
}


