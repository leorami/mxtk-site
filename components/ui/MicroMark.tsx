'use client'



export default function MicroMark({ size = 16, className = '' }:{
  size?: number; className?: string;
}) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || '') || ''
  const src = `${base}/art/mxtk_micro_mark_${Math.max(12, Math.min(24, size))}.svg`
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


