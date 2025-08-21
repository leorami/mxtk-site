'use client'
import { themeForPath, type MineralTheme } from '@/lib/brand/theme'
import { stripBase } from '@/lib/routing/basePath'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext<MineralTheme | null>(null)
export const useBrandTheme = () => useContext(Ctx)!

export default function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const raw = usePathname() || '/'
  const [mounted, setMounted] = useState(false)

  const neutral = useMemo<MineralTheme>(() => ({
    name: 'home', accent: '#E0932B', hoverBg: 'rgba(224,147,43,.14)', photo: '/minerals/photos/amber-crystal.svg'
  }), [])

  const themed = useMemo(() => themeForPath(stripBase(raw)), [raw])

  useEffect(() => setMounted(true), [])

  const theme = mounted ? themed : neutral

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
