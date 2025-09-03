# Automated Testing for MXTK Site

This document consolidates our testing approach, commands, and troubleshooting for prefix-agnostic navigation, visual accessibility, and overall site health.

## Overview

Our automated tests verify that:
- Internal links render as absolute, prefix-correct hrefs after hydration
- The `/mxtk` prefix is preserved when served behind a proxy
- Click-through navigation works across key routes
- Footer links from legal pages do not incorrectly include `/legal/`
- Pages load without console or network errors above thresholds
- Page text meets WCAG 2.1 AA contrast requirements (see Crawl + Contrast Audit below)

## Test Commands

```bash
# Localhost navigation (no prefix)
npm run test:nav:localhost

# Ngrok navigation (with /mxtk prefix)
npm run test:nav:ngrok

# Generic: test any URL by providing BASE_URL
BASE_URL=http://localhost:2000 node tools/test/nav-regression.mjs
BASE_URL=https://<your-ngrok-domain>/mxtk node tools/test/nav-regression.mjs

# Full debug suite (screenshots, extended checks)
npm run test:full
```

Scripts are defined in `package.json` and use Puppeteer under the hood.

## What the Tests Do

Primary file: `tools/test/nav-regression.mjs`

- Loads pages and waits for network idle
- Collects all `<a href>` values post-hydration
- Infers expected prefix from `BASE_URL` and validates all internal links
  - Localhost: internal hrefs must start with `/` and NOT with `/mxtk/`
  - Ngrok: internal hrefs must start with `/mxtk/`
- Clicks through key navigation paths to confirm real navigation works
- Verifies footer links on legal pages escape `/legal/`
- Fails if console/network error counts exceed thresholds

### Crawl + Contrast Audit

Primary file: `tools/test/crawl-regression.mjs`

- Recursively crawls internal links starting from `BASE_URL`
- Records console/network errors and docker logs for the last window
- Computes text contrast for common text elements (`a, button, p, h1-3, th, td`), using dynamic background detection per element
- Fails when any page has contrast below WCAG 2.1 AA:
  - Normal text: 4.5:1
  - Large/bold text (>= 24px or >= 18.66px bold): 3.0:1
  
Artifacts are written to `tools/debug/output/reports/*.json` with a `contrastTotals.violations` count per run.

Additional debug utilities live in `tools/debug/`:
- `debug.js`: theme/CSS variable checks, screenshots, and error thresholding
- `debug-links.js`: prints links currently rendered in the DOM (manual inspection)

Artifacts (screenshots/reports) are written under `tools/debug/output/`.

## Scenarios Covered

1. Landing page anchors validated against expected prefix
2. Click-through from home to Owners route with URL assertion
3. Legal page footer links verified to avoid `/legal/` in non-legal targets
4. Header/footer internal links iterated to ensure prefix consistency after navigation

## CI/CD Integration

Recommended pre-deploy checks:
```bash
# Navigation (localhost + ngrok)
npm run test:nav:localhost
npm run test:nav:ngrok

# Crawl + contrast
BASE_URL=http://localhost:2000 node tools/test/crawl-regression.mjs
BASE_URL=https://<your-ngrok-domain>/mxtk node tools/test/crawl-regression.mjs
```
You can also run the full debug suite via `npm run test:full`.

## Troubleshooting

### Owners link not found
- Ensure the home page renders and includes the Owners link. Run locally at http://localhost:2000

### Expected prefixed href starting with "/mxtk/"
- Ensure the proxy is mounted at `/mxtk` and the app is not using `basePath`
- Confirm navigation helpers from `lib/routing/basePath.ts` are used for internal links

### Footer link must not contain "/legal/"
- Confirm footer components build hrefs via `getRelativePath(..., currentPathname)`

### General debugging
```bash
node tools/debug/debug-links.js
```

## Related Documentation

- `docs/NGINX_PROXY_SETUP_GUIDE.md` – full guide for prefix-based proxy configuration and verification
- `PROJECT_RULES.md` – testing requirements and enforcement


