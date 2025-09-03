> Deprecated — This project is basePath-agnostic.

MXTK no longer uses Next.js `basePath` or `assetPrefix`. The app serves at root; the dev/proxy layer mounts it at `/mxtk` and rewrites SSR output as needed. Client code uses prefix-aware helpers.

Start here instead:

- `docs/DEV_TUNNEL_PROXY_INTEGRATION.md` — proxy + helper approach (authoritative)
- `docs/NGINX_PROXY_SETUP_GUIDE.md` — nginx prefix mount and internals
- `docs/SIMULTANEOUS_ACCESS_GUIDE.md` — using localhost and `/mxtk` simultaneously
