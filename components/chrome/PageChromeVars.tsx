'use client'

import { useEffect } from 'react'

/**
 * Sets CSS vars --nav-height and --footer-height to the actual rendered sizes
 * of the header and footer so right-pinned UI (guide drawer) can align exactly
 * between them without overlapping or causing scroll jumps.
 */
export default function PageChromeVars(){
  useEffect(()=>{
    const root = document.documentElement
    const measure = () => {
      try {
        const header = document.querySelector('.brand-header') as HTMLElement | null
        const accent = document.querySelector('.brand-accent-line') as HTMLElement | null
        const footer = document.querySelector('.brand-footer') as HTMLElement | null
        const headerH = (header?.offsetHeight || 0)
        const accentH = (accent?.offsetHeight || 0)
        const footerH = (footer?.offsetHeight || 0) || 64
        root.style.setProperty('--nav-height', `${headerH + accentH}px`)
        root.style.setProperty('--footer-height', `${footerH}px`)
      } catch {}
    }
    measure()
    const onResize = () => { measure() }
    window.addEventListener('resize', onResize)
    const id = window.setInterval(measure, 500) // guard against late layout shifts
    return () => { window.removeEventListener('resize', onResize); window.clearInterval(id); }
  }, [])
  return null
}


