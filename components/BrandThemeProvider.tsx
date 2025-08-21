'use client'
import { themeForPath, type MineralTheme } from '@/lib/brand/theme'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useMemo } from 'react'

const Ctx = createContext<MineralTheme | null>(null)
export const useBrandTheme = () => useContext(Ctx)!

export default function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const raw = usePathname() || '/'

  const theme = useMemo(() => themeForPath(raw), [raw])

  return (
    <Ctx.Provider value={theme}>
      <div
        suppressHydrationWarning
        style={{ ['--mxtk-accent' as any]: theme.accent, ['--mxtk-hover-bg' as any]: theme.hoverBg } as React.CSSProperties}
        data-mineral={theme.name}
        data-photo={theme.photo}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}
