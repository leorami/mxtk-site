# MXTK Testing Guide

## Install Chrome for Puppeteer (host)

```bash
npx puppeteer browsers install chrome
export PUPPETEER_EXECUTABLE_PATH="$HOME/.cache/puppeteer/chrome/<platform-version>/Google Chrome for Testing"
```

## Console auditor

```bash
# Localhost
PATHS='/mxtk,/mxtk/dashboard' node tools/test/console-error-check.mjs http://localhost:2000
# Ngrok
PATHS='/mxtk,/mxtk/dashboard' node tools/test/console-error-check.mjs https://<ngrok-domain>
```

## Widgets grid E2E

```bash
# Localhost
BASE_URL=http://localhost:2000/mxtk node tools/test/dashboard-drag.mjs
# Ngrok
BASE_URL=https://<ngrok-domain>/mxtk node tools/test/dashboard-drag.mjs
```

- Validates: move/resize, server persistence via `/api/ai/home/default`, and no mobile overlap.

## Dashboard screens

```bash
BASE_URL=http://localhost:2000 node tools/test/dashboard-screens.mjs
BASE_URL=https://<ngrok-domain> node tools/test/dashboard-screens.mjs
```

## Navigation regression

```bash
npm run test:nav:localhost
npm run test:nav:ngrok
```
