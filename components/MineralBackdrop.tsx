'use client'
import AppImage from '@/components/ui/AppImage'
import { themeForPath } from '@/lib/brand/theme'
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
      <div aria-hidden className="-z-10 pointer-events-none" inert>
        <div className="fixed inset-0 overflow-hidden">
          {/* soft gradient wash matching accent */}
          <div className="absolute inset-0 opacity-[.10] dark:opacity-[.12]" style={{ background: `radial-gradient(1200px 600px at 80% -10%, var(--mxtk-accent), transparent)` }} />
        </div>
      </div>
    )
  }

  const theme = themeForPath(pathname)

  return (
    <div aria-hidden className="-z-10 pointer-events-none" inert>
      <div className="fixed inset-0 overflow-hidden">
        {/* soft gradient wash matching accent */}
        <div className="absolute inset-0 opacity-[.10] dark:opacity-[.12]" style={{ background: `radial-gradient(1200px 600px at 80% -10%, var(--mxtk-accent), transparent)` }} />
        {/* mineral image top-right */}
        <div className="absolute right-[-6%] top-[-8%] h-[58vh] w-[58vh] opacity-[.14] blur-[6px] mix-blend-multiply dark:opacity-[.18]">
          <AppImage src={theme.photo} alt="" fill sizes="58vh" style={{ objectFit:'contain' }} />
        </div>
        {/* subtle grain */}
        <div className="absolute left-[-12%] bottom-[-14%] h-[48vh] w-[48vh] opacity-[.10] blur-[8px] mix-blend-multiply dark:opacity-[.16]">
          <AppImage src={'minerals/grain.svg'} alt="" fill sizes="48vh" style={{ objectFit:'contain' }} />
        </div>
      </div>
    </div>
  )
}
