'use client'
import { themeForPath } from '@/lib/brand/theme'
import { withBase } from '@/lib/routing/basePath'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MineralBackdrop(){
  const pathname = usePathname() || '/'
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until client-side to avoid hydration mismatches
  if (!mounted) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* soft gradient wash matching accent */}
        <div className="absolute inset-0 opacity-[.10] dark:opacity-[.12]" style={{ background: `radial-gradient(1200px 600px at 80% -10%, var(--mxtk-accent), transparent)` }} />
      </div>
    )
  }

  // Use pathname-based theme to ensure consistency between server and client
  const pathTheme = themeForPath(pathname)
  const photoPath = pathTheme.photo

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft gradient wash matching accent */}
      <div className="absolute inset-0 opacity-[.10] dark:opacity-[.12]" style={{ background: `radial-gradient(1200px 600px at 80% -10%, var(--mxtk-accent), transparent)` }} />
      {/* mineral image top-right */}
      <div className="absolute right-[-6%] top-[-8%] h-[58vh] w-[58vh] opacity-[.14] blur-[6px] mix-blend-multiply dark:opacity-[.18]">
        <Image src={withBase(photoPath)} alt="" fill sizes="58vh" style={{ objectFit:'contain' }} priority />
      </div>
      {/* subtle grain */}
      <div className="absolute left-[-12%] bottom-[-14%] h-[48vh] w-[48vh] opacity-[.10] blur-[8px] mix-blend-multiply dark:opacity-[.16]">
        <Image src={withBase("/minerals/grain.svg")} alt="" fill sizes="48vh" style={{ objectFit:'contain' }} priority />
      </div>
    </div>
  )
}
