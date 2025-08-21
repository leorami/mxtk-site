'use client'
import Image from 'next/image'
import { useBrandTheme } from './BrandThemeProvider'

export default function MineralBackdrop(){
  const theme = useBrandTheme()
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft gradient wash matching accent */}
      <div className="absolute inset-0 opacity-[.10] dark:opacity-[.12]" style={{ background: `radial-gradient(1200px 600px at 80% -10%, var(--mxtk-accent), transparent)` }} />
      {/* mineral image top-right */}
      <div className="absolute right-[-6%] top-[-8%] h-[58vh] w-[58vh] opacity-[.14] blur-[6px] mix-blend-multiply dark:opacity-[.18]">
        <Image src={theme.photo} alt="" fill sizes="58vh" style={{ objectFit:'contain' }} priority />
      </div>
      {/* subtle grain */}
      <div className="absolute left-[-12%] bottom-[-14%] h-[48vh] w-[48vh] opacity-[.10] blur-[8px] mix-blend-multiply dark:opacity-[.16]">
        <Image src="/minerals/grain.svg" alt="" fill sizes="48vh" style={{ objectFit:'contain' }} priority />
      </div>
    </div>
  )
}
