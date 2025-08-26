# MXTK Site - Dev Tunnel Proxy Integration

This document outlines the integration of the MXTK site with the generic dev-tunnel-proxy project.

## Changes Made

### 1. Configuration Files Updated

#### `next.config.js`
- ✅ **UPDATED**: Removed `basePath` and `assetPrefix` configuration to prevent redirect loops
- ✅ Now uses nginx sub_filter for URL rewriting instead of Next.js basePath
- ✅ Toggles `MXTK_BEHIND_PROXY` environment variable for tunnel detection

#### `middleware.ts`
- ✅ **UPDATED**: Simplified to handle paths directly without base path manipulation
- ✅ Skips Next.js internals, HMR, and WebSocket connections
- ✅ Optional basic auth (disabled by default in development)

#### `app/api/health/route.ts`
- ✅ Health check endpoint already exists at `/api/health`

### 2. Docker Configuration

#### `docker-compose.yml` (Base - Local Development)
- ✅ Service exposes port 2000 internally
- ✅ Runs on 0.0.0.0
- ✅ No `MXTK_BEHIND_PROXY` set (root path)
- ✅ Added `devproxy` external network
- ✅ Health check configured

#### `docker-compose.tunnel.yml` (Tunnel Override)
- ✅ Sets `MXTK_BEHIND_PROXY=1`
- ✅ Disables basic auth for tunnel
- ✅ Joins both `default` and `devproxy` networks
- ✅ Removed old ngrok-specific configuration

### 3. Nginx Configuration

#### `config/dev-proxy/apps/mxtk.conf`
- ✅ **UPDATED**: Enhanced nginx configuration to prevent redirect loops
- ✅ Handles both `/mxtk` and `/mxtk/` paths
- ✅ Properly strips `/mxtk` prefix before proxying to Next.js
- ✅ Uses sub_filter to rewrite absolute links to include `/mxtk` prefix
- ✅ Includes WebSocket/HMR support
- ✅ Proper forwarding headers

### 4. Helper Scripts

#### `scripts/dev-proxy-install.sh`
- ✅ Created executable script to install nginx config
- ✅ Copies config to dev-tunnel-proxy project
- ✅ Reloads nginx if proxy is running
- ✅ Provides helpful error messages

#### `scripts/setup-mxtk-site.sh` (Updated)
- ✅ Added `tunnel` and `tunnel-stop` commands
- ✅ Auto-detects dev-tunnel-proxy in common locations
- ✅ Seamless integration with dev-tunnel-proxy

### 5. Navigation System
- ✅ **UPDATED**: `lib/routing/basePath.ts` with prefix-aware navigation helper
- ✅ Client-side detection of deployment prefix (e.g., `/mxtk`)
- ✅ Automatic generation of absolute URLs that preserve the correct prefix
- ✅ SSR fallback with client-side hydration correction
- ✅ App remains agnostic to deployment environment

### 6. Documentation Updates
- ✅ Updated integration instructions to use dev-tunnel-proxy
- ✅ Updated documentation to reflect nginx sub_filter approach
- ✅ Added comprehensive navigation testing documentation

## How It Works

### Local Development
- App runs at root `/` (no basePath)
- Direct access via `http://localhost:2000`
- Navigation links use absolute paths (e.g., `/owners`, `/institutions`)

### Tunnel Access
- Nginx proxy handles `/mxtk` prefix
- Strips prefix before sending to Next.js app
- Navigation links automatically detect and preserve the `/mxtk` prefix
- Access via `https://ramileo.ngrok.app/mxtk/`

### Navigation System

The MXTK site uses a prefix-aware navigation system that automatically adapts to the deployment environment:

#### Client-Side Detection
- **Local Development**: Links generate as `/owners`, `/institutions`, etc.
- **Tunnel Access**: Links automatically detect `/mxtk` prefix and generate as `/mxtk/owners`, `/mxtk/institutions`, etc.

#### Implementation Details
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

#### Navigation Behavior
- **Top Navigation**: All header links automatically preserve the correct prefix
- **Footer Links**: Links from deep pages (e.g., `/legal/terms`) correctly escape subdirectories
- **Deep Routes**: Navigation works consistently from any page depth
- **App Agnostic**: No hardcoded prefixes in the application code

### Redirect Loop Prevention
- Next.js no longer uses basePath configuration
- Nginx handles all prefix management
- Navigation helper automatically detects and preserves prefixes
- Both `/mxtk` and `/mxtk/` paths work correctly

### 6. Environment Configuration Updates

- ✅ Removed ngrok settings from environment templates
- ✅ Added `DEV_TUNNEL_PROXY_DIR` to all environment templates
- ✅ Development template: Active configuration with default path
- ✅ Staging/Production templates: Commented configuration (optional)
- ✅ Local template: Active configuration for blockchain development

## Usage Instructions

### Local Development (Root Path)
```bash
./scripts/setup-mxtk-site.sh start
# Access at: http://localhost:2000/
# Health check: http://localhost:2000/api/health
```

### Tunnel Development (Prefix Path) - Smart Integration
```bash
# Simply run share - it will automatically set up dev-tunnel-proxy integration
./scripts/setup-mxtk-site.sh share

# The share command will:
# 1. Check if dev-tunnel-proxy is running
# 2. Install MXTK config if needed
# 3. Connect to ngrok network
# 4. Provide tunnel URLs
```

### Manual Tunnel Setup (Alternative)
```bash
# 1. Start the dev-tunnel-proxy project
cd /path/to/dev-tunnel-proxy
./scripts/smart-build.sh up

# 2. Install MXTK config into the proxy
# Option A: Use environment variable
DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh

# Option B: Add to .env file and run without parameter
echo "DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy" >> .env
./scripts/dev-proxy-install.sh

# 3. Start MXTK with tunnel configuration
docker compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d

# 4. Access via tunnel
# Main app: https://<ngrok-domain>/mxtk
# Health check: https://<ngrok-domain>/mxtk/api/health
```

## Updated Script Commands

The updated `setup-mxtk-site.sh` script now includes:

- **Smart `share` command** - Automatically handles dev-tunnel-proxy integration
- Removed deprecated commands: `setup-proxy`, `stop-proxy`, `restart-proxy`

## Path Configuration

The `DEV_TUNNEL_PROXY_DIR` supports multiple path formats:

### Supported Path Types:
- **Absolute paths:** `/Users/leorami/Development/dev-tunnel-proxy`
- **Home directory expansion:** `~/Development/dev-tunnel-proxy`
- **Relative paths:** `../dev-tunnel-proxy`, `../../dev-tunnel-proxy`

### Configuration Methods:
1. **Environment variable (inline):**
   ```bash
   DEV_TUNNEL_PROXY_DIR=~/Development/dev-tunnel-proxy ./scripts/dev-proxy-install.sh
   ```

2. **Add to .env file (recommended):**
   ```bash
   echo "DEV_TUNNEL_PROXY_DIR=~/Development/dev-tunnel-proxy" >> .env
   ./scripts/dev-proxy-install.sh
   ```

### Auto-Detection (Legacy)

The old `tunnel` command automatically searched for dev-tunnel-proxy in common locations:
- `../dev-tunnel-proxy`
- `../../dev-tunnel-proxy`
- `$HOME/Development/dev-tunnel-proxy`
- `$HOME/dev-tunnel-proxy`

## Validation Checklist

- [ ] Local development works at root path (`http://localhost:2000/`)
- [ ] Health check responds at `/api/health`
- [ ] Tunnel mode works with `/mxtk` prefix
- [ ] WebSocket/HMR connections work in both modes
- [ ] Next.js internals (`/_next/`, etc.) are not intercepted
- [ ] Nginx config is properly installed in dev-tunnel-proxy
- [ ] `./scripts/setup-mxtk-site.sh share` automatically handles dev-tunnel-proxy integration

### Navigation Testing
- [ ] **Local Development**: All navigation links work correctly (e.g., `/owners`, `/institutions`)
- [ ] **Tunnel Access**: All links preserve `/mxtk` prefix (e.g., `/mxtk/owners`, `/mxtk/institutions`)
- [ ] **Deep Routes**: Navigation from nested pages (e.g., `/legal/terms`) works correctly
- [ ] **Footer Links**: Links from legal pages escape subdirectory context
- [ ] **Post-Hydration Verification**: Run `npm run test:nav:localhost` and `npm run test:nav:ngrok` to verify DOM behavior
- [ ] **Click-Through Testing**: Navigation actually works by clicking through to target pages

### Automated Navigation Testing
The project includes comprehensive navigation testing that can be run to verify the integration:

```bash
# Test localhost navigation
npm run test:nav:localhost

# Test ngrok navigation
npm run test:nav:ngrok

# Test with custom URL
BASE_URL=https://your-domain.com/mxtk npm run test:navigation

# Full regression test with detailed reporting
npm run test:full
```

The tests verify:
- **Post-hydration DOM verification**: Checks that links have correct absolute URLs after client-side hydration
- **Prefix-aware behavior**: Ensures `/mxtk` prefix is preserved on ngrok, absent on localhost
- **Click-through testing**: Verifies navigation actually works by clicking through to target pages
- **Footer link escape**: Confirms footer links from legal pages don't contain `/legal/` in their hrefs
- **Cross-environment consistency**: Validates behavior across localhost and ngrok environments

## Service Name

The nginx configuration uses `mxtk-site-dev` as the service name, which matches the container name in `docker-compose.yml`. If you need to change this, update both files accordingly.

## Network Configuration

The MXTK service joins the external `devproxy` network when running in tunnel mode, allowing it to communicate with the dev-tunnel-proxy nginx container.
