# Nginx Proxy Setup (Dev Tunnel)

## Requirements
- Mount app at `/mxtk` (preserve-mode)
- Allow-list root `/_next/*` and HMR (`/_next/webpack-hmr`)
- Do not use `sub_filter` to rewrite HTML; Next injects internals

## Minimal snippets

```nginx
# Subpath preserve-mode
location ^~ /mxtk/ {
  proxy_pass http://mxtk-site-dev:2000/mxtk/;
  proxy_set_header X-Forwarded-Prefix /mxtk;
  proxy_set_header Host $host;
}

# Next dev internals at root (assets/HMR)
location ^~ /_next/webpack-hmr { proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "Upgrade"; proxy_pass http://mxtk-site-dev:2000/_next/webpack-hmr; }
location ^~ /_next/ { proxy_pass http://mxtk-site-dev:2000/_next/; }
```

> Deprecated: configs that rewrite HTML with `sub_filter` for `href`/`src`.
