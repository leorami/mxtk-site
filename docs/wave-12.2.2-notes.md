# Wave 12.2.2 — Forced Scaffold Background + Single-Section Home

- PageScaffold now merges `backgroundClass` at the root and exposes stable hooks:
  - `.page-scaffold`, `.scaffold-hero`, `.scaffold-main`, `.scaffold-section`, `.section-header`, `.section-title`, `.section-actions`, `.section-body`.
- CSS adds mineral/diamond backgrounds and smaller section headers; footer brand legibility enforced via `.site-footer .footer-brand`.
- Home uses one hero + one section via `PageScaffold` with `backgroundClass="mxtk-bg-mineral"`.
- Tests: `tools/test/w12.2.2-home-visual-lock.mjs` ensures single 'Your Home' heading, background present, footer brand color matches links; saves screenshots.

