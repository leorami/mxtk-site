# MXTK Sherpa: Ingestion and Admin Tools

## Ingesting Knowledge

- DOCX: Convert to text/markdown before ingest.
  - macOS:
    ```bash
    for f in docs/reference/*.docx; do base="$(basename "$f" .docx)"; textutil -convert txt -stdout "$f" > "docs/reference/${base}.txt"; done
    ```
  - Pandoc:
    ```bash
    for f in docs/reference/*.docx; do base="$(basename "$f" .docx)"; pandoc "$f" -t gfm -o "docs/reference/${base}.md"; done
    ```

- CLI:
  ```bash
  npm run ai:ingest -- ./docs/reference/overview.txt
  npm run ai:ingest -- --text "MXTK is ..." --source "overview-manual"
  ```

- API:
  ```bash
  curl -sS -X POST ${BASE_URL:-http://localhost:2000}/api/ai/ingest \
    -H 'content-type: application/json' \
    --data '{"content":"MXTK is ...","source":"overview-api"}'
  ```

## Vector Store Management

- Status: `GET /api/ai/vector/status` → `{ ok, chunks, embeddings }`
- Reset: `POST /api/ai/vector/reset` with header `Authorization: Bearer ${ADMIN_TOKEN}`
- Clean rebuild: reset, then re-ingest all sources.
- The system auto re-embeds when vector dimensions mismatch (e.g., mock → live).

## Admin UI (/admin)

- Admin page: visit `/admin` to sign in, then use the links to tools.
- Tools: `/admin/tools`
  - View vector counts
  - Reset store (admin only)
  - Paste-and-ingest form (text/markdown)
  - Upload & ingest files (DOCX, PDF, MD, TXT)
- Flags: `/admin/flags`
- Costs: `/admin/costs`

## Admin Access & Tokens

- Recommended: use one strong secret for all three to keep it simple.
  - `MXTK_ADMIN_TOKEN`: used on `/admin` sign-in
  - `ADMIN_TOKEN`: used by protected admin APIs (Authorization: Bearer …)
  - `NEXT_PUBLIC_ADMIN_TOKEN`: same value so admin UI fetches work

- Generate a token (pick one):
  ```bash
  # OpenSSL (base64, stripped to URL-safe, 40 chars)
  openssl rand -base64 32 | tr -d '=/+' | cut -c1-40

  # Node.js (hex)
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- Add to your `.env`:
  ```bash
  MXTK_ADMIN_TOKEN=PASTE_GENERATED_TOKEN_HERE
  ADMIN_TOKEN=PASTE_GENERATED_TOKEN_HERE
  NEXT_PUBLIC_ADMIN_TOKEN=PASTE_GENERATED_TOKEN_HERE
  ```

- Apply changes:
  - Restart your dev stack (e.g., `./smart-dev-build.sh apply`) and reload the site.

- How to use:
  - Web admins: go to `/admin`, paste `MXTK_ADMIN_TOKEN` to sign in.
  - API (e.g., vector reset):
    ```bash
    curl -X POST http://localhost:2000/api/ai/vector/reset \
      -H "Authorization: Bearer PASTE_GENERATED_TOKEN_HERE"
    ```

## Mode-Aware Sherpa

- Modes: `learn | explore | analyze` (sent by client)
- System prompt adapts tone and includes an MXTK domain guide.
- RAG context is injected into the first system message.
- For beginner (“learn”) users: simple, patient, low-jargon explanations.

## Home Integration

- On certain prompts (teach/explain/define), responses are summarized and auto-suggested to Home.
- The client auto-adds a summary widget when `meta.homeWidget` is present.
- Home menu appears when cookie `mxtk_home_id` exists (header shows “Home”).

## Environment

- Set `OPENAI_API_KEY` (or `openai_api_key`) to enable live chat/embeddings.
- Ensure `AI_VECTOR_DIR` points to the data dir (default `./ai_store`).
- Admin routes secured via `ADMIN_TOKEN`.
