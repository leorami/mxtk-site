# Wave 10.0 — Admin Flags Review UI + Human-in-the-Loop (MVP)

## Files Added/Changed (highlights)
- lib/ai/govern/types.ts — Flag/Review types
- lib/ai/govern/schema.ts — Zod schemas + helpers
- lib/ai/govern/store.ts — JSONL flags/reviews + index, CRUD/list
- lib/ai/govern/signals.ts — Signals sink JSONL
- app/api/ai/flags/route.ts — GET list (legacy + new), PUT action
- app/api/ai/flags/[id]/route.ts — GET one, PUT review action
- app/api/ai/flags/seed/route.ts — DEV/TEST only seeds
- app/api/ai/govern/signals/route.ts — POST/GET signals
- app/api/admin/session/route.ts — Minimal admin cookie session
- app/admin/page.tsx — Admin landing (signin or link)
- app/admin/flags/page.tsx — SSR shell with client FlagsClient
- components/admin/AdminSignin.tsx — Sign-in form
- components/admin/FlagsClient.tsx — Table, filters, actions
- components/admin/FlagDetailPanel.tsx — Inline detail panel
- tools/test/w10-flags.mjs — Puppeteer e2e for flags
- tools/test/w8-nav-debug.mjs — Extended to check drawer on admin flags
- tests/govern-*.test.ts — Unit tests for schemas/store/signals

Storage paths:
- ai_store/govern/flags.jsonl
- ai_store/govern/reviews.jsonl
- ai_store/govern/index.json
- ai_store/govern/signals.jsonl

Notes:
- Governance signals collected; do not change runtime decisions yet.
- Cache-Control: no-store applied to admin/flags endpoints.
- No basePath literals added; UI uses relative paths.

## How to run
```bash
./smart-dev-build.sh
npm run test --silent
node tools/test/w10-flags.mjs
```
Artifacts:
- Screenshots: .tmp/mxtk/w10-flags-*.png
- Styles dump: .tmp/mxtk/w10-flags-styles.json

## Admin gating
- POST /api/admin/session with { token } equals env MXTK_ADMIN_TOKEN
- Cookie set: mxtk_admin=1; Path=/; SameSite=Lax; HttpOnly; Secure if https
- SSR pages gate by cookie; APIs accept cookie or Authorization: Bearer ADMIN_TOKEN

## Compliance with project rules
- Next.js app router; SSR-safe components (no window in render paths)
- Tailwind classes; light mode default; no drawer overlay regressions
- Atomic JSONL writes; Zod on inputs; no middleware/proxy changes
- No '/mxtk' literals or basePath mutations
