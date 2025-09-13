# Nginx Proxy – Option B (Prefix) Setup
**Goal:** App is agnostic; externally it lives at `/mxtk/`. Nothing (except Next dev internals) is reachable at domain root.

## Architecture

```
Internet → Nginx Proxy → Next.js App (at root)
           /mxtk/*     → / (app root)
           /_next/*    → /_next/* (Next.js assets)
           /*          → 404 (blocked)
```

### Why the trailing-slash rule matters
If the browser is at /mxtk (no slash), the URL base is treated as a file, so relative paths like logo-horizontal.svg resolve to /logo-horizontal.svg (root) and 404. Redirecting /mxtk → /mxtk/ fixes that permanently.

### Multiple Next apps?
Mount each app at its own prefix and repeat the "allow Next internals" blocks per upstream:
/foo/, /bar/ etc. Keep the root 404.

## Key Principles

### ✅ Do's

1. **Keep Next.js App Agnostic**
   - No `basePath` or `assetPrefix` in `next.config.js`
   - App serves at root internally (`/`)
   - Use relative asset paths (`src="logo.svg"`)

2. **Block Root Pages**
   - Return 404 for all root paths except `/_next/*`
   - Prevents accidental exposure of app at root

3. **Allow Next.js Internals**
   - Always allow `/_next/*` at root for assets and HMR
   - Include WebSocket support for development

4. **Handle Both Prefix Forms**
   - `/prefix` and `/prefix/` should both work
   - Normalize `/prefix` → `/prefix/` with a single 308 at the mount point to keep relative URLs stable

5. **Set Proper Headers**
   - `X-Forwarded-Prefix` for app awareness
   - `X-Forwarded-Proto` for HTTPS detection
   - `Upgrade` and `Connection` for WebSockets

### ❌ Don'ts

1. **Don't Use Next.js basePath**
   ```javascript
   // ❌ Wrong - makes app prefix-aware
   const nextConfig = {
     basePath: '/mxtk'
   };
   ```

2. **Don't Allow Root Access**
   ```nginx
   # ❌ Wrong - exposes app at root
   location / {
       proxy_pass http://app_upstream;
   }
   ```

3. **Don't Use Redirects**
   ```nginx
   # ❌ Wrong - causes 308 redirects
   location /prefix {
       return 301 /prefix/;
   }
   ```

4. **Don't Hardcode Prefixes in App**
   ```javascript
   // ❌ Wrong - app becomes prefix-aware
   <Link href="/mxtk/owners">Owners</Link>
   ```

## Implementation Steps

### 1. Prepare Your Next.js App

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // App is agnostic; no basePath/assetPrefix.
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ['lucide-react'] },
  trailingSlash: false,
};

module.exports = nextConfig;
```

### 2. Use Relative Navigation Helpers

```typescript
// lib/routing/basePath.ts
export function getRelativePath(targetPath: string, currentPathname: string = '/'): string {
  const target = stripLeading(targetPath);
  const depth = routeSegmentsExcludingPrefix(currentPathname).length;
  const up = depth > 0 ? '../'.repeat(depth) : '';
  return up + target;
}

// components/SiteHeader.tsx
import { getRelativePath } from '@/lib/routing/basePath';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  
  return (
    <Link href={getRelativePath('owners', pathname)}>Owners</Link>
  );
}
```

### 3. Configure Nginx

1. Create your app config file:
   ```bash
   # config/dev-proxy/apps/your-app.conf
   ```

2. Add the configuration template above

3. Update the upstream server name and port

4. Reload Nginx:
   ```bash
   nginx -s reload
   ```

## Testing Your Setup

### Manual Verification

```bash
# These should return 404 (root pages blocked)
curl -I https://your-domain.com/
curl -I https://your-domain.com/owners

# These should return 200 (Next internals allowed at root)
curl -I https://your-domain.com/_next/static/chunks/webpack.js

# These should return 200 (prefixed pages)
curl -I https://your-domain.com/your_prefix
curl -I https://your-domain.com/your_prefix/owners
```

### Automated Testing

Use the navigation regression testing tool:

```bash
npm run test:navigation
```

This will test:
- Code sanity checks
- Nginx configuration
- Navigation behavior (localhost and ngrok)
- Link prefix consistency

## Common Issues and Solutions

### Issue 1: App Still Accessible at Root

**Symptoms**: `https://domain.com/` returns 200 instead of 404

**Cause**: Root blocking location blocks are missing or incorrect

**Solution**:
```nginx
# Add these blocks BEFORE your prefix location
location = / { return 404; }
location ~ ^/(?!_next/).+ { return 404; }
```

### Issue 2: Next.js Assets Not Loading

**Symptoms**: 404 errors for `/_next/static/*` files

**Cause**: `/_next/*` location block is missing or incorrect

**Solution**:
```nginx
location ^~ /_next/ {
    proxy_pass http://your_app_upstream/_next/;
    # ... other proxy headers
}
```

### Issue 3: Navigation Links Drop Prefix

**Symptoms**: Links work on first page but lose prefix after navigation

**Cause**: App is not using prefix-aware navigation helpers

**Solution**:
```typescript
// Use getRelativePath with current pathname
const pathname = usePathname() || '/';
<Link href={getRelativePath('target', pathname)}>Link</Link>
```

### Issue 4: Footer Links Get Stuck in Subdirectories

**Symptoms**: From `/prefix/legal/terms`, footer links become `/prefix/legal/media`

**Cause**: Footer using plain relative paths instead of prefix-aware helpers

**Solution**:
```typescript
// In footer component
const pathname = usePathname() || '/';
<Link href={getRelativePath('media', pathname)}>Media</Link>
```

### Issue 5: 308 Redirects

**Symptoms**: Unexpected 308 chains or redirects outside the mount normalization

**Cause**: Redirects elsewhere in the config (beyond the single mount-point redirect)

**Solution**:
```nginx
# Keep only one normalization for the mount point
location = /prefix { return 308 /prefix/; }
# All other prefix traffic proxies without further redirects
location ^~ /prefix/ { proxy_pass http://upstream; }
```

## Performance Considerations

### 1. Keepalive Connections
```nginx
upstream your_app_upstream {
    server your-app:port;
    keepalive 64;  # Reuse connections
}
```

### 2. Timeouts
```nginx
proxy_read_timeout 300;
proxy_send_timeout 300;
```

### 3. WebSocket Support
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

## Security Considerations

### 1. Block Root Access
Always block root pages to prevent accidental exposure.

### 2. Validate Upstream
Ensure upstream server is properly secured and accessible only via proxy.

### 3. Headers
Set appropriate security headers in your Next.js app, not in Nginx proxy.

## Monitoring and Debugging

### 1. Nginx Logs
```bash
# Check error logs
tail -f /var/log/nginx/error.log

# Check access logs
tail -f /var/log/nginx/access.log
```

### 2. Test Configuration
```bash
# Validate Nginx config
nginx -t

# Reload configuration
nginx -s reload
```

### 3. Health Checks
```bash
# Test upstream connectivity
curl -I http://your-app-container:port/

# Test proxy endpoints
curl -I https://your-domain.com/your_prefix/health
```

## Migration from Other Setups

### From basePath Setup

1. Remove `basePath` from `next.config.js`
2. Update all navigation links to use relative helpers
3. Add Nginx configuration
4. Test thoroughly

### From Subdirectory Setup

1. Move app to root of container
2. Update Docker configuration
3. Add Nginx configuration
4. Update any hardcoded paths

## Best Practices Summary

1. **App Agnosticism**: Keep Next.js app prefix-unaware
2. **Proxy Intelligence**: Let Nginx handle prefix routing
3. **Relative Navigation**: Use prefix-aware helpers for all links
4. **Root Blocking**: Always block root pages
5. **Asset Allowlisting**: Allow only `/_next/*` at root
6. **Testing**: Use automated regression testing
7. **Documentation**: Document your setup for team members

## Troubleshooting Checklist

- [ ] Next.js app has no `basePath` or `assetPrefix`
- [ ] Nginx blocks root pages (404)
- [ ] Nginx allows `/_next/*` at root (200)
- [ ] Nginx handles `/prefix` and `/prefix/` (200)
- [ ] App uses `getRelativePath()` for navigation
- [ ] All components import `usePathname()`
- [ ] No hardcoded absolute paths in app
- [ ] Nginx configuration reloaded
- [ ] Upstream server is running and accessible
- [ ] Automated tests pass

## Support

For issues specific to this setup:

1. Check the troubleshooting section above
2. Run the automated regression tests
3. Review Nginx error logs
4. Verify upstream connectivity
5. Test with curl commands
6. Check browser network tab for redirects

This setup provides a robust, scalable solution for serving Next.js apps behind prefixes while maintaining app agnosticism and proper navigation behavior.

## See Also

- `docs/AUTOMATED_TESTING.md` – run navigation regression to validate your proxy setup
