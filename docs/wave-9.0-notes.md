### Wave 9.0 — Adaptive Home (MVP grid + widget shell)

- Files added: `lib/home/gridTypes.ts`, `lib/home/pureStore.ts`, `lib/home/fileStore.ts`, `lib/home/schema.ts`, `components/home/{HomeClient.tsx,Grid.tsx,WidgetFrame.tsx,widgets/*}`, `components/ai/AddToHomeButton.tsx`, tests `tools/test/{w9-home.mjs,a11y-home.mjs}`.
- Files updated: `app/api/ai/home/[id]/route.ts`, `app/api/ai/home/add/route.ts`, `app/api/ai/chat/route.ts`, `app/home/page.tsx`, `components/SiteHeader.tsx`, `components/ai/GuidePanel.tsx`, `tests/home-store.test.ts`.

How to run:
- Build (Docker): `./smart-dev-build.sh`
- Unit tests: `npm test` (Vitest; reducers covered in `tests/home-store.test.ts`)
- Integration: `node tools/test/w9-home.mjs` (screenshots at `tools/test/artifacts/`)

Home data:
- Stored under `/ai_store/homes/{id}.json` with atomic write (tmp + rename).
- Cookie: `mxtk_home_id` (Path=/, SameSite=Lax, Secure on https) set server-side.

APIs:
- GET `/api/ai/home/{id}` returns `{ ok, doc }` with `Cache-Control: no-store`.
- PUT `/api/ai/home/{id}` validates via Zod and persists.
- POST `/api/ai/home/add` creates Home if missing, dedupes by (type,title) for 30s, returns `{ homeId, widget }`.

UI:
- SSR `/home` reads cookie and server-fetches initial doc. Client hydrates grid with responsive 12/6/1 columns.
- WidgetFrame includes accessible icon cluster (aria-labels), no horizontal scrolling.

Sherpa:
- Chat response includes `meta.suggestHome`. Guide shows non-blocking `AddToHomeButton`.

Guardrails satisfied:
- No basePath mutation or `/mxtk` literals; using existing helpers and server cookies.
- Drawer remains width-driven; SSR-safe components.


