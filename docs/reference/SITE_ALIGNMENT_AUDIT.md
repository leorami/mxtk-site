## Site Alignment Audit — mineral-token.com parity (2025-09-14)

### Sources
- Snapshot (rendered/html): `docs/reference/external/mineral-token.com/<ts>/`
- Bot transcript attempt: `docs/reference/external/mineral-token.com/<ts>/bot/`
- Summaries: `EXTERNAL_MINERAL_TOKEN_SUMMARY.md`, `EXTERNAL_MINERAL_TOKEN_COPY_RECOMMENDATIONS.md`

### Implemented
- Crawl/render/archive external homepage; add summary/copy docs.
- Chat ingest tooling integrated into auditor stack (transcript + screenshot artifacts).
- External rendered text ingested into embeddings; full re-embed performed.
- Homepage alignment:
  - Added `components/home/StatsBar.tsx` with `$33B+ / 1:1 / Global` (preview tagged, source noted).
  - Tweaked home hero subcopy to mention 1:1-backed and AI-guided explanations.

### Outstanding (follow-ups)
- Bot capture: provider-specific selectors needed (current transcript shows no auto-detected input). Action: inspect production widget markup or share provider details to finalize selectors.
- Provenance links: replace preview/source labels with links to proofs once available (IPFS, audits, oracle logs, OTC aggregates).
- Owners/resources pages: include AI-guided teaser and stepper links consistent with external site messaging.

### Checks
- Build: ok (dev); navigation regression: passed.
- Vector store: re-embedded with current embedder; total chunks updated.
