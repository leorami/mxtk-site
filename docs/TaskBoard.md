# MXTK Site Task Board

This board tracks the current Home UX wave and only preserves older items still relevant to this workstream. Development follows `PROJECT_RULES.md`: Docker-only runtime, TypeScript-first, WCAG 2.1 AA, Tailwind, tests with Vitest/RTL. Each task includes its own test/verify loop.

## Workstream: Home UX Wave 1 (from annotated screenshots)

1) Recent Answers question accuracy and widget borders
- [x] Fix question button label to always show the user’s actual question (storage/mapping fix)
- [x] Lighten container borders inside widgets in dark mode to match glass UI
- [x] Tests: unit for question mapping; visual/DOM tests for dark-mode border classes; update snapshots
- [x] Verify in Docker (smart-dev-build apply), run tests, capture screenshots

2) Insert Info ContentWidget between Status cards and Learn section
- [x] Build reusable `ContentWidget` with exact title/copy styling as highlights info section
- [x] Inject into `Home` between Status cards and the first "Training" section; content-driven and easily swappable
- [x] Tests: component render and accessibility; content injection integration on Home
- [x] Verify visually in both themes

2.a) ContentWidget and placement fixes
- [x] Hide empty sections in `DashboardContent` (tested)
- [ ] Auto-place new widgets within their section without overlap
- [ ] ContentWidget frameless (no borders/shadows) to flow within section
- [ ] Add MXTK-Info-1/2/3 and MXTK-Footer sections; move ContentWidget to MXTK-Info-1; seed/order; tests

3) Price chart placeholder and multi-asset support
- [ ] When no historical data for a specific token, mineral, stock, etc., render labeled mock flat series at last known price
- [ ] Show token chip in red when data unavailable (API/data issue)
- [ ] Add additional series for BTC, ETH, USDC, DAI; use relative/log-friendly scale for comparison
- [ ] Tests: deterministic mocked datasource for series composition and chip state logic
- [ ] Verify chart renders non-empty and legends/labels are clear

4) Hide sections without widgets
- [ ] Do not render empty sections until widgets exist
- [ ] Tests: Home layout should not include placeholder sections; assert count/order of rendered sections

5) Layout moves: Price and Pools
- [ ] Move Price widget to first row, to the right of Recent Answers
- [ ] Make Pools widget expand to full section width in its row
- [ ] Optional: list prices for extra tokens and add commodities section (gold, copper, lithium, oil)
- [ ] Tests: DOM order and grid sizing; accessibility of table and chips

6) Add Journey cards in the new MXTK-Info-2 section between section 1 and 2 (from highlights page)
- [ ] Port cards (icons/title/copy) and make content journey-phase aware
- [ ] Improve sections so that they can be rendered as "Ghost" (outlined [no border, shadow] and transparent) so content appears like it's on the main content container (like the title & description at the top of the page). Make MXTK-Info-2 a ghost section.
- [ ] Tests: card presence within the MXTK-Info-2 section, ordering, ARIA roles, contrast

7) Pool table dark-mode polish
- [ ] Improve header/row text colors and alternating row backgrounds in dark mode
- [ ] Tests: class/token assertions across themes; contrast checks within thresholds

8) Remove blank starter widgets and adjust first row
- [ ] Remove `WhatsNext` and `Note` from initial Home default seed
- [ ] Make `RecentAnswers` leftmost and same height/width as `Price` so they appear side-by-side
- [ ] Tests: seed-driven Home renders without blank widgets; first row composition assertions

9) Process, tooling and governance for this wave
- [ ] Commit work in themed, verified increments; branch per major improvement
- [ ] Run tests locally (or in Docker) per change; keep debug tools BASE_PATH-free
- [ ] Update this TaskBoard with progress; attach evidence when applicable
- [ ] Don't push anything. Commits only.

## Preserved items relevant to this wave

- [ ] Ngrok Theme System: ensure theme variables and switching work in ngrok context
  - Files: `components/BrandThemeProvider.tsx`, `components/MineralBackdrop.tsx`, `lib/brand/theme.ts`
- [ ] “Sizzle” Data Publishing: incremental API integrations to enrich Home data (market/on-chain)
- [ ] CI basics for this wave: minimal GitHub Action to run tests on PRs touching `app/`, `components/`, `lib/`, `tests/`

## Definition of Done (per item)
- Implement feature/fix
- Add/extend tests (unit + integration where applicable)
- Run tests and lint; fix regressions
- Validate in Docker via `./smart-dev-build.sh apply` (use `--force-build` if necessary)
- Commit with clear, themed message; open PR if needed

## Quick Commands
- Docker dev: `./setup-mxtk-site.sh` then `./smart-dev-build.sh apply`
- Tests: `pnpm test` or `pnpm test:unit`


