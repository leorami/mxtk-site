# Wave 12.2.3 — Rename Home to Dashboard + True Parity with Site Patterns

This patch **does NOT touch middleware/proxy/basePath** and **reuses your existing design system**:
PageTheme, BackgroundPhoto, PageHero, SectionWrapper, ModeTextSwap, Card, HomeClient.

## Files in this patch (drop in as‑is)
- `app/dashboard/page.tsx` (NEW) — the actual Dashboard page using the *same* primitives as Contact/FAQ.
- `app/home/page.tsx` (REPLACE) — tiny redirect to `/dashboard` so old links keep working.
- `components/copy/dashboard.ts` (NEW) — page copy for the Dashboard (hero & short sections).

## One‑line code edits you must make in your repo

1) **Register the new copy key** in your copy hook:
   Open `components/copy/Copy.ts` and add:

   ```ts
   import { dashboardCopy } from '@/components/copy/dashboard'
   // ...
   const PAGES = {
     // ...existing entries
     dashboard: dashboardCopy,
   } as const
   ```

   If `PageId` is a union type, add `'dashboard'` to it.

2) **Header nav label** (optional but recommended):
   In `components/SiteHeader.tsx`, change the old Home link to point to `/dashboard`
   and label it **Dashboard**. (A small diff file is included in `patches/` for reference.)

## Why this works

- `BackgroundPhoto variant="home"` reuses `/public/art/photos/home_gold.jpg` via your existing component,
  so **the background matches Landing/Contact exactly** without editing the photo map.
- `PageTheme ink="warm" lift="H" glass="soft"` + `Card` give you the same glass, lift,
  and shadow behavior as the rest of the site.
- `HomeClient` renders your grid/widgets with the current persistence logic—no rewrites.

## Safety
- No basePath changes. No middleware changes. No proxy changes.
- SSR‑safe: Dashboard is a client component like Contact/FAQ.

## After dropping files
1. `git add -A`
2. `git commit -m "wave(12.2.3): Rename Home->Dashboard; parity with site primitives; /home -> /dashboard redirect"`
3. `git tag wave-12.2.3`

## If the background doesn't appear
- Confirm `components/visuals/BackgroundPhoto.tsx` has a `'home'` variant pointing to
  `public/art/photos/home_gold.jpg`. Every other page uses that successfully; we reuse it.

## If the copy hook is centralized differently
- Just make sure the `'dashboard'` key resolves to `dashboardCopy` from `components/copy/dashboard`.
- Temporarily, you can call `useCopy('home')` in `app/dashboard/page.tsx` to reuse the landing copy,
  but the patch already ships a dedicated `dashboardCopy` so product wording can diverge later.
