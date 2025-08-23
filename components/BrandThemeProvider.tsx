'use client'
import { themeForPath, type MineralTheme } from '@/lib/brand/theme'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useMemo, useEffect, useState } from 'react'

const Ctx = createContext<MineralTheme | null>(null)
export const useBrandTheme = () => useContext(Ctx)!

// Helper function to lighten a color for dark mode
function lightenColor(hex: string, percent: number = 58): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  // Lighten by mixing with white
  const lightR = Math.round(r + (255 - r) * (percent / 100))
  const lightG = Math.round(g + (255 - g) * (percent / 100))
  const lightB = Math.round(b + (255 - b) * (percent / 100))
  
  // Convert back to hex
  return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const raw = usePathname() || '/'
  const [mounted, setMounted] = useState(false)

  const theme = useMemo(() => themeForPath(raw), [raw])

  // Check for dark mode only after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate accent text color based on theme mode
  const accentTextColor = useMemo(() => {
    if (!mounted) {
      // During SSR and initial render, use the base color to match server
      return theme.accent
    }
    
    // After mounting, check for dark mode
    const isDark = document.documentElement.classList.contains('dark')
    return isDark ? lightenColor(theme.accent, 58) : theme.accent
  }, [theme.accent, mounted])

  return (
    <Ctx.Provider value={theme}>
      <div
        suppressHydrationWarning
        style={{ 
          ['--mxtk-accent' as any]: theme.accent, 
          ['--mxtk-hover-bg' as any]: theme.hoverBg,
          ['--mxtk-accent-text' as any]: accentTextColor,
          ['--mxtk-accent-rgb' as any]: hexToRgb(theme.accent)
        } as React.CSSProperties}
        data-mineral={theme.name}
        data-photo={theme.photo}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}
