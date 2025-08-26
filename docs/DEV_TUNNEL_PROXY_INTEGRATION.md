# MXTK Site - Dev Tunnel Proxy Integration

This document describes the working pattern that lets our Next.js app run:
- at the domain root in development, staging, and production (e.g., `/` on `localhost`, staging, production), and
- behind a subpath when accessed through a shared dev tunnel proxy (e.g., `/mxtk` on `https://<ngrok>/mxtk`).

The app itself remains deployment-agnostic (no Next.js `basePath` or `assetPrefix`). Prefix management is handled by:
- client-side helpers for links and assets; and
- nginx in the proxy layer for SSR-emitted absolute paths and HMR.

---

## What We Changed (Authoritative Summary)

### 1) Next.js app remains root-aware only
- No `basePath` and no `assetPrefix` in `next.config.js`.
- `middleware.ts` is a no-op pass-through.
- All internal links and public asset URLs are generated with `lib/routing/basePath.ts` helpers:
  - `getRelativePath()` for internal navigation
  - `getPublicPath()` for assets under `public/`
  - `getApiPath()` for `/api/*` routes
- These helpers detect the external prefix on the client and prepend `/mxtk` only when needed.

### 2) Proxy handles SSR and dev internals
`config/dev-proxy/apps/mxtk.conf` was enhanced to:
- proxy Next.js dev internals (`/_next/*`, `__nextjs_*`), with WebSocket upgrade headers
- disable proxy buffering for HMR stability
- rewrite absolute `href="/…"` and `src="/…"` in HTML via `sub_filter`
- proxy a safe set of root-level public assets that SSR may reference without a prefix:
  - `/favicon.ico`, `/favicon.svg`, `/icons/`, `/organizations/`, `/media/`
- block other unexpected root paths when accessed via the proxy

Key directives in the `/mxtk` location:
```
proxy_set_header Accept-Encoding "";       # required for sub_filter
sub_filter_types text/html;
sub_filter 'href="/' 'href="/mxtk/';
sub_filter 'src="/'  'src="/mxtk/';
sub_filter_once off;
proxy_buffering off; proxy_request_buffering off;
proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";
```

### 3) Client components fixed to be prefix-aware
- `components/OrganizationLogo.tsx` uses `getPublicPath()` with the current pathname to build logo URLs that work on both `localhost` and `/mxtk`.

### 4) Robust navigation tests
- `tools/test/nav-regression.mjs` validates that:
  - all internal links are absolute and correctly prefixed after hydration
  - header/footer links navigate successfully
  - console/network errors are surfaced (excluding benign dev warnings)
  - both `http://localhost:2000` and `https://<ngrok>/mxtk` pass

---

## How It Works

### Local development (root)
- App runs at `http://localhost:2000/`
- All links and assets are root-absolute (e.g., `/owners`, `/icons/...`)

### Tunnel access (subpath)
- Access via `https://<ngrok-domain>/mxtk/`
- The proxy rewrites SSR-emitted absolute links in HTML and passes selected root assets through.
- On the client, our helpers detect `/mxtk` and render prefix-aware links and asset URLs.

---

## Reference snippets

### Link and asset helpers (client-aware)
```ts
// lib/routing/basePath.ts
export function getRelativePath(target: string, currentPathname?: string): string
export function getPublicPath(asset: string, currentPathname?: string): string
export function getApiPath(path: string, currentPathname?: string): string
```

Usage in components:
```tsx
<Link href={getRelativePath('owners', pathname)}>
  Owners
</Link>
<img src={getPublicPath('icons/mineral/icon-facet.svg', pathname)} />
```

### Nginx notes
- Upstream service resolves to Docker DNS name. With the default compose service `web`, Docker typically exposes it as `mxtk-site-web-1` internally; our config uses:
  - `proxy_pass http://mxtk-site-web-1:2000/...`
- Keep `proxy_buffering off` and upgrade headers for HMR stability.
- `Accept-Encoding ""` is required so `sub_filter` can see/modify HTML.

---

## Usage

### Local (root)
```bash
./scripts/setup-mxtk-site.sh start
# http://localhost:2000/
```

### Tunnel (subpath)
```bash
./scripts/setup-mxtk-site.sh share
# Outputs ngrok URL, e.g., https://<domain>/mxtk
```

Manual install to an external dev-proxy (optional):
```bash
DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh
```

---

## Validation checklist

- [ ] Local root works at `http://localhost:2000/`
- [ ] Tunnel access works at `https://<ngrok>/mxtk/`
- [ ] No 404s for `/icons/`, `/media/`, `/organizations/`, favicons
- [ ] HMR/WebSocket connects through proxy
- [ ] `npm run test:nav:localhost` passes
- [ ] `npm run test:nav:ngrok` passes

Notes:
- In dev, the HMR WebSocket stays open; DevTools may show a long “Finish” time on that request. This is expected and does not indicate slow rendering.

---

## Service and network

- Compose service: `web` (port `2000`); Docker names it like `mxtk-site-web-1`.
- The proxy container and the app must share a Docker network so nginx can reach `mxtk-site-web-1:2000`.
