# Cursor Instructions — Fix nav colors, restore dark/glass look, responsive menus, and themed pages

**Context (what broke):**
- Top/bottom nav switched to a dark background that clashes with the logo. We want **white nav (light mode)** back, with a proper **dark mode** that preserves the original glass/shadow/lift.
- Undocumented “cool/warm” or “tone” changes were introduced. **Remove all tone toggles/components**.
- Glass cards, buttons, shadows, and hover lift were degraded. **Restore the earlier look**.
- **Footer no longer pinned** to the bottom.
- **Institutions, Transparency, Whitepaper** headings/links fell back to generic black text instead of **page theme accents**.
- Top nav **is not responsive**; menus disappear on narrow screens.
- The **“More” menu is broken** (can’t click subitems) and should be called **“Resources”**.
- The **menu order** needs to match the spec below.

> Keep the **/mxtk basePath** support (via `NEXT_PUBLIC_BASE_PATH`) exactly as previously implemented.

---

## ✅ Acceptance Criteria (test this after changes)
1) Top nav background is **white in light mode** and **dark translucent** in dark mode. The logo is **`/logo-horizontal.svg`** (or PNG fallback), no extra “MXTK” text node next to it.
2) A **sun/moon** light/dark switch is present and working. **No tone/cool/warm toggle** anywhere.
3) Glass cards/buttons/shadow/lift look **polished again** (like before).
4) **Footer is pinned**: on short pages it sits at the bottom of the viewport; on long pages it follows content.
5) **Institutions, Transparency, Whitepaper** (and others) show **page-accented headings/links**, not plain black.
6) **Responsive nav**: on narrow screens, a hamburger opens a panel with all top-level links, including “Resources” items.
7) **Resources dropdown**: hover/focus/click works; submenu stays open long enough to click items.
8) Menu items and footer items appear **in the exact order** requested (see below).
9) Links work under **`/mxtk`** and locally without it.

---

## 1) Remove any “tone/cool/warm/bold” toggles and code
- Delete the **components and imports** related to “tone”, “cool/warm”, or “bold/pro” voice.
  - Remove files if present: `components/ToneProvider.tsx`, `components/ToneSwitch.tsx`, `lib/brand/tone.ts`.
  - Remove their imports/usages from `app/layout.tsx`, `components/SiteHeader.tsx`, and any page components.
- Remove any CSS blocks targeting `[data-tone]` or “tone” classes.
- Do **not** touch the light/dark theme switch (sun/moon) — we keep that.

> If any page content branches on tone, revert to the **Institutional** copy.

---

## 2) Restore top nav background color (white in light mode)
**Edit `app/globals.css` (or your main global stylesheet):**
- Replace the **brand header** styles with the following:

```css
/* Header bar: white in light mode, dark translucent in dark mode */
.brand-header { background: #ffffff; color: #0B0E12; border-bottom: 1px solid var(--border-soft); }
.dark .brand-header { background: rgba(11,14,18,.92); color: #E6EAF2; backdrop-filter: saturate(1.2) blur(6px); }

/* Keep the accent line slim and elegant */
.brand-accent-line { height: 2px; background: linear-gradient(90deg, #0B1C4A, #E0932B, #0FBF9F); }

/* Nav pills: hover background is set from each target route's theme via --hover-bg */
.nav-pill:hover { background: var(--hover-bg); }
.nav-pill[aria-current="page"] { background: var(--hover-bg); }
```

- Ensure **no rule** sets `.brand-header` to black in light mode.

**Use the correct logo:**
- Place (or confirm) `/public/logo-horizontal.svg` (preferred) and `/public/logo-horizontal.png` as fallback.

---

## 3) Simplify and fix the top nav (order + Resources dropdown + responsiveness)
**Edit `components/SiteHeader.tsx` and replace its contents with the following:**

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSwitch from './ThemeSwitch'
import { themeForRoute } from '@/lib/brand/theme'

type Item = { href: string; label: string }

const TOP_ORDER: Item[] = [
  { href: '/owners',        label: 'Owners' },
  { href: '/institutions',  label: 'Institutions' },
  { href: '/transparency',  label: 'Transparency' },
  { href: '/ecosystem',     label: 'Ecosystem' },
  { href: '/resources',     label: 'Resources' }, // acts as dropdown trigger on desktop
  { href: '/whitepaper',    label: 'Whitepaper' },
  { href: '/faq',           label: 'FAQ' },
  { href: '/elite-drop',    label: 'MXTK Gives' },
]

/** Items that live under the "Resources" dropdown on desktop (also appear in mobile panel) */
const RESOURCES_DROPDOWN: Item[] = [
  { href: '/resources',   label: 'Overview' },
  { href: '/media',       label: 'Media' },
  { href: '/the-team',    label: 'Team' },
  { href: '/careers',     label: 'Careers' },
  { href: '/contact-us',  label: 'Contact' },
]

export default function SiteHeader(){
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)      // mobile panel
  const [resOpen, setResOpen] = useState(false) // resources dropdown (desktop)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setResOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div className="brand-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4" style={{height:'76px'}}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center" aria-label="MXTK Home">
              <Image src="/logo-horizontal.svg" alt="MXTK" width={140} height={32} style={{height:'32px', width:'auto'}} priority />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {TOP_ORDER.map(({href,label}) => {
              const t  = themeForRoute(href)
              const is = pathname === href || pathname.startsWith(href + '/')

              if (label === 'Resources') {
                return (
                  <div key="resources" className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      aria-expanded={resOpen}
                      onClick={() => setResOpen(v => !v)}
                      className="nav-link nav-pill px-3 py-2 rounded-lg transition-colors"
                      style={{ ['--hover-bg' as any]: t.hoverBg } as React.CSSProperties}
                    >
                      Resources
                    </button>
                    {resOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] shadow-xl py-2">
                        {RESOURCES_DROPDOWN.map(({href: h, label: l}) => {
                          const th = themeForRoute(h)
                          return (
                            <Link
                              key={h}
                              href={h}
                              className="block px-3 py-2 rounded-md hover:bg-[var(--hover-bg)]"
                              style={{ ['--hover-bg' as any]: th.hoverBg } as React.CSSProperties}
                              onClick={() => setResOpen(false)}
                            >
                              {l}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={is ? 'page' : undefined}
                  className="nav-link nav-pill px-3 py-2 rounded-lg transition-colors"
                  style={{ ['--hover-bg' as any]: t.hoverBg } as React.CSSProperties}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitch />
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-[var(--border-soft)] px-3 py-2"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
      <div className="brand-accent-line" />

      {/* Mobile panel */}
      {open && (
        <div className="lg:hidden border-t border-[var(--border-soft)] bg-[var(--surface-2)]">
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-1">
            {TOP_ORDER.map(({href,label}) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)]"
                style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-[var(--border-soft)] text-xs uppercase tracking-wide text-muted">More</div>
            {RESOURCES_DROPDOWN.map(({href,label}) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)]"
                style={{ ['--hover-bg' as any]: themeForRoute(href).hoverBg } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3"><ThemeSwitch /></div>
          </div>
        </div>
      )}
    </header>
  )
}
```

**Notes:**
- Uses **`/logo-horizontal.svg`**.
- Removes the stray “MXTK” text.
- Desktop shows the **exact top-menu order** (with “Resources” acting as the dropdown trigger).
- Mobile panel shows **all items**.
- Per-item hover uses the theme for the **target route** (so **every** menu item has a colored hover).
- No inline setting of black header—light mode is white via CSS.

---

## 4) Footer pinned to bottom
**Edit `app/layout.tsx`** to ensure this exact structure/classes (do not wrap `<main>` with other fixed-height containers):

```tsx
// Inside RootLayout:
<html lang="en" suppressHydrationWarning>
  <body className="min-h-dvh flex flex-col">
    {/* providers... */}
    <SiteHeader />
    <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 mineral-sheen">
      <MineralBackdrop />
      {children}
    </main>
    <SiteFooter />
  </body>
</html>
```

**Also:**
- Remove `min-h-screen` from **page-level** containers that might fight the layout.
- Ensure `SiteFooter` is **not** `position: fixed;` — it should be a normal block element after `<main>`.

---

## 5) Restore glass/shadow/lift and light/dark switch
**In `app/globals.css`** ensure these exist (and not overridden): 

```css
/* Glass surfaces */
.glass { background: rgba(255,255,255,.66); border:1px solid var(--border-soft); backdrop-filter: blur(8px) saturate(1.1); border-radius: 1rem; }
.dark .glass { background: rgba(18,22,28,.66); }

/* Embedded cards inherit slightly darker/lighter than parent */
.glass-embedded .glass, .glass-embedded [data-embedded] { background: rgba(255,255,255,.52); }
.dark .glass-embedded .glass, .dark .glass-embedded [data-embedded] { background: rgba(18,22,28,.52); }

/* Hover lift */
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); }
:root { --shadow-lift-sm: 0 6px 18px rgba(0,0,0,.08); }

/* Buttons */
.btn-base { display:inline-flex; align-items:center; gap:.5rem; border-radius:.9rem; padding:.6rem 1rem; font-weight:600; transition: transform .15s, box-shadow .15s, background-color .15s, color .15s; }
.btn-base:hover { transform: translateY(-1px); box-shadow: var(--shadow-lift-sm); }
.btn-primary { background: var(--mxtk-accent); color:#fff; }
.btn-outline { border:1px solid var(--mxtk-accent); color: var(--mxtk-accent); background: transparent; }
.btn-soft { background: var(--mxtk-hover-bg); color: var(--mxtk-accent); }
.btn-link { padding:.3rem .6rem; border-radius:.6rem; color: var(--mxtk-accent); }
.btn-link:hover, .btn-outline:hover { background: var(--mxtk-hover-bg); }
```

**Light/dark switch:** keep the existing sun/moon toggle component (no changes). Remove any tonal/tone switch components.

---

## 6) Ensure headings/links use page theme accents
**In `app/globals.css`** (or your tokens file), ensure:

```css
/* Headings & key links derive from page accent */
[data-mineral] h1, [data-mineral] h2 { color: var(--mxtk-accent); }
[data-mineral] a.btn-link { color: var(--mxtk-accent); }

/* Prevent tailwind base from forcing black headings */
.page h1, .page h2 { color: inherit; }
```

**In `lib/brand/theme.ts`** make sure the route→theme mapping is correct for:
- `/institutions` → navy accent
- `/transparency` → navy accent
- `/whitepaper` → navy accent

If the pages still show black headings, wrap the top-level content blocks in the appropriate `.section section-navy|amber|teal` containers so their internals inherit accents consistently.

---

## 7) Footer link order and content
**Edit `components/SiteFooter.tsx`** to have this exact link order (update labels/paths as needed):

- **Bottom nav (left→right):**
  - Terms → `/terms`
  - Privacy → `/privacy`
  - Disclosures → `/disclosures`
  - Media → `/media`
  - Team → `/the-team`
  - Careers → `/careers`
  - Contact → `/contact-us`

Ensure the footer has no fixed positioning and inherits body text colors properly.

---

## 8) Verify /mxtk basePath still works
- Confirm `NEXT_PUBLIC_BASE_PATH=/mxtk` in `.env.local` for ngrok; blank for local.
- `next.config.js` uses:
  ```js
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  module.exports = { basePath, assetPrefix: basePath, images:{ unoptimized:true } }
  ```
- All `<Link href="/route">` should **not** include `/mxtk` (Next will add it). For manual constructed URLs (preloads, `<img>`), use the helper `withBase()` if needed.

---

## 9) Final QA checklist
- Desktop:
  - White top nav, correct logo, Resources dropdown works (click to open, stays open, items clickable).
  - Hover any nav item → colored background matches its target page.
  - Institutions/Transparency/Whitepaper headings are accented (navy), not black.
- Mobile:
  - Hamburger opens panel; all items present, including Resources group items.
- Light/Dark:
  - Light shows white nav; dark shows translucent dark with glass effect. Cards/buttons have lift/shadow.
- Layout:
  - Footer pinned at bottom on short pages.
- No console hydration warnings originating from `SiteHeader` or the theme provider.

---

## Commit message
```
UI: restore white nav (light), fix Resources dropdown & mobile menu, remove tone toggle, reinstate glass/shadows, pin footer, reapply page accents, keep /mxtk basePath
```
