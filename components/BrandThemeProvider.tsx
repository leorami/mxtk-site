'use client'
import { themeForPath, type MineralTheme } from '@/lib/brand/theme'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useMemo } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

const Ctx = createContext<MineralTheme | null>(null)
export const useBrandTheme = () => useContext(Ctx)!

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

// Compute WCAG contrast ratio helpers
function luminanceFromHex(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const srgb = [r, g, b].map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))) as [number, number, number]
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

function contrastRatio(hex1: string, hex2: string): number {
  const L1 = luminanceFromHex(hex1)
  const L2 = luminanceFromHex(hex2)
  const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1]
  return (light + 0.05) / (dark + 0.05)
}

function chooseAccessibleTextColorForAccent(accentHex: string): string {
  const black = '#0E1116'
  const white = '#FFFFFF'
  // Pick the higher contrast between black and white
  const cBlack = contrastRatio(accentHex, black)
  const cWhite = contrastRatio(accentHex, white)
  return cBlack >= cWhite ? black : white
}

export default function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const raw = usePathname() || '/'

  const theme = useMemo(() => themeForPath(raw), [raw])
  const accentText = useMemo(() => chooseAccessibleTextColorForAccent(theme.accent), [theme.accent])

  return (
    <Ctx.Provider value={theme}>
      <ParallaxProvider>
        <div
          suppressHydrationWarning
          style={{ 
            // Route-specific accent variables drive buttons, links, outlines, and hovers
            ['--mxtk-accent' as any]: theme.accent,
            ['--mxtk-hover-bg' as any]: theme.hoverBg,
            ['--mxtk-accent-rgb' as any]: hexToRgb(theme.accent),
            ['--mxtk-accent-fg' as any]: accentText
          } as React.CSSProperties}
          data-mineral={theme.name}
          data-photo={theme.photo}
        >
          {children}
        </div>
      </ParallaxProvider>
    </Ctx.Provider>
  )
}
