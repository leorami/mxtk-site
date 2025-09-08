# Wave 12.2.1 — Home cohesion + Starter + Seed

- Single scaffold: `app/home/page.tsx` now renders one hero and one section header; shows `Grid` or `StarterPanel` when empty.
- StarterPanel: client component with chips to add widgets, presets (Learn/Build/Operate), and an Ask Sherpa action.
- Seed endpoint: `POST /api/ai/home/seed` with `{ level, homeId? }`; idempotent — seeds only if empty; returns updated Home.
- Visuals: mineral background class `mxtk-bg-mineral`, tighter `.section-header` scale, and footer brand legibility via `.footer-brand`.
- Tests: `tools/test/w12.2.1-home-starter.mjs` exercises empty → seeded flow, background presence, header duplication guard, footer legibility, and screenshots.
