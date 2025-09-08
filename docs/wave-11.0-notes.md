## Wave 11.0 — Public Facts Surface (JSON + API with ETag/version)

### Contract
- FactsDoc: `{ version: number; updatedAt: number; data: { project: { name: string; tagline? }; assets?; governance?; models?; links?; misc? } }`
- Runtime validation via Zod in `lib/facts/schema.ts`.

### Endpoints
- GET /api/ai/facts
  - 200 with JSON body and headers: `ETag`, `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
  - 304 if `If-None-Match` matches.
- HEAD /api/ai/facts
  - Same headers as GET, no body; honors conditional.
- PUT /api/ai/facts (admin)
  - Guard: `mxtk_admin=1` cookie or `x-admin-token` header matching env token.
  - Body: `{ data: FactsDoc['data'] }` fully replaces data; version increments.
  - Response: updated JSON + `ETag`, `Cache-Control: no-store`.
- PATCH /api/ai/facts (admin)
  - Guard as above. Body: `{ data: Partial<FactsDoc['data']> }` deep-merges, then validates and writes; version increments.

### Storage
- File: `ai_store/facts.json`. Atomic writes (tmp + rename). ETag computed per-response via SHA-256 of canonical JSON.

### SSR View
- `/facts` renders a read-only summary, server-fetching the API. Includes a client "Copy JSON" button.

### Rollback
- Use git history for `ai_store/facts.json` to revert. ETag will change accordingly.

### Usage in UI
- Use server-side fetch with `getBasePathUrl('/api/ai/facts')` to respect proxy/basePath.


