# Navigation Testing Documentation

This document describes the navigation testing system for the MXTK site, which verifies that the prefix-aware navigation works correctly across different deployment environments.

## Overview

The navigation testing system validates that:
- Links generate the correct absolute URLs after client-side hydration
- The `/mxtk` prefix is preserved when deployed behind a proxy
- Navigation actually works by clicking through to target pages
- Footer links from legal pages don't contain unwanted `/legal/` segments

## Test Scripts

### Primary Test Commands

```bash
# Test localhost navigation (no prefix)
npm run test:nav:localhost

# Test ngrok navigation (with /mxtk prefix)
npm run test:nav:ngrok

# Test with custom URL
BASE_URL=https://your-domain.com/mxtk npm run test:navigation
```

### Legacy Test Commands

```bash
# Full regression test with detailed reporting
npm run test:full

# Quick navigation test (legacy)
npm run test:regression
```

## Test Implementation

### Main Test File: `tools/test/nav-regression.mjs`

The primary test file uses Puppeteer to:
1. **Load pages** and wait for hydration to complete
2. **Extract all anchor hrefs** from the DOM
3. **Verify prefix behavior** based on the BASE_URL
4. **Click through navigation** to verify actual functionality
5. **Check footer link escape** on legal pages

### Expected Behavior

#### Localhost Testing (`BASE_URL=http://localhost:2000`)
- **Expected Prefix**: `''` (no prefix)
- **Link Format**: `/owners`, `/institutions`, `/transparency`, etc.
- **Validation**: All internal links must start with `/` and NOT contain `/mxtk/`

#### Ngrok Testing (`BASE_URL=https://ramileo.ngrok.app/mxtk`)
- **Expected Prefix**: `/mxtk`
- **Link Format**: `/mxtk/owners`, `/mxtk/institutions`, `/mxtk/transparency`, etc.
- **Validation**: All internal links must start with `/mxtk/`

### Test Scenarios

#### 1. Landing Page Verification
- Loads the home page
- Extracts all anchor hrefs after hydration
- Verifies prefix behavior matches the environment

#### 2. Click-Through Testing
- Finds the "Owners" link on the home page
- Clicks through to the Owners page
- Verifies the final URL matches expected format

#### 3. Legal Page Footer Testing
- Loads `/legal/terms` (or `/mxtk/legal/terms` on ngrok)
- Checks all footer links
- Ensures non-legal links don't contain `/legal/` in their hrefs

## Navigation System Architecture

### Client-Side Detection

The navigation system uses client-side detection to determine the deployment prefix:

```typescript
// lib/routing/basePath.ts
export function getRelativePath(targetPath: string, currentPathname: string = '/'): string {
  const target = stripLeading(targetPath);

  if (typeof window !== 'undefined') {
    // Client-side: Detect prefix from window.location
    const parts = window.location.pathname.split('/').filter(Boolean);
    const maybePrefix = parts[0]?.toLowerCase();
    const prefix = maybePrefix === 'mxtk' ? '/mxtk' : '';
    return `${prefix}/${target}`;
  }

  // SSR fallback; hydration will adjust on client
  return `/${target}`;
}
```

### Hydration Process

1. **Server-Side Rendering**: Links render as absolute paths (e.g., `/owners`)
2. **Client-Side Hydration**: JavaScript detects the deployment prefix
3. **DOM Update**: Links are updated to include the correct prefix
4. **Test Verification**: Tests run after hydration to verify final DOM state

## Test Output

### Success Output
```
✅ nav-regression: all checks passed
```

### Failure Examples

#### Wrong Prefix on Localhost
```
[FAIL] Localhost must not use "/mxtk" prefix :: href="/mxtk/owners"
```

#### Missing Prefix on Ngrok
```
[FAIL] Expected prefixed href starting with "/mxtk/" :: href="/owners"
```

#### Footer Link with Legal Prefix
```
[FAIL] Footer link must not contain "/legal/" :: href="/mxtk/legal/media"
```

#### Navigation Failure
```
[FAIL] Owners page URL should be "/mxtk/owners", got: https://ramileo.ngrok.app/owners
```

## Troubleshooting

### Common Issues

#### Test Fails with "Owners link not found"
- **Cause**: The test can't find a link containing "Owners" text
- **Solution**: Check that the home page loads correctly and contains navigation links

#### Test Fails with "Expected prefixed href"
- **Cause**: Links don't have the expected prefix after hydration
- **Solution**: Verify the navigation helper is working correctly and the page has hydrated

#### Test Fails with "Footer link must not contain '/legal/'"
- **Cause**: Footer links from legal pages contain unwanted `/legal/` segments
- **Solution**: Check that the footer component uses `getRelativePath()` correctly

### Debugging

#### Manual Verification
```bash
# Check what links are actually in the DOM
node tools/debug/debug-links.js
```

#### Custom URL Testing
```bash
# Test with a different ngrok URL
BASE_URL=https://your-ngrok-url.ngrok.app/mxtk npm run test:navigation
```

#### Environment Variables
- `BASE_URL`: Required environment variable specifying the test URL
- `DEBUG`: Set to enable additional logging (if supported)

## Integration with CI/CD

### Pre-deployment Testing
```bash
# Test both environments before deployment
npm run test:nav:localhost
npm run test:nav:ngrok
```

### Automated Testing
The tests can be integrated into CI/CD pipelines to ensure navigation works correctly across all environments.

## Dependencies

- **Puppeteer**: Required for headless browser testing
- **Node.js**: ES modules support for `.mjs` files

## Related Documentation

- [Dev Tunnel Proxy Integration](./DEV_TUNNEL_PROXY_INTEGRATION.md) - How the navigation system integrates with the proxy
- [Nginx Proxy Setup Guide](./NGINX_PROXY_SETUP_GUIDE.md) - Proxy configuration details
