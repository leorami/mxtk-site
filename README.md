# MXTK Site - Mineral Token Platform

A comprehensive platform for digitizing verified mineral interests with transparent, governed market plumbing. Built with Next.js, TypeScript, and modern web technologies.

## 🚀 Key Features

- **🎨 Dynamic Theme System**: Path-based mineral themes with automatic color adaptation
- **🌙 Dark/Light Mode**: Persistent theme toggle with system preference detection
- **🔍 Transparency Hub**: Live on-chain data, IPFS proofs, oracle logs, and OTC aggregates
- **🏢 Institutional Tools**: KYC integration, escrow services, and compliance features
- **📱 Responsive Design**: Mobile-first approach with accessibility compliance
- **🔧 Development Tools**: Comprehensive debugging, testing, and deployment infrastructure

## 🎯 Recent Major Updates

### Infrastructure & Development
- **Docker Integration**: Containerized dev with optional shared dev tunnel proxy
- **Deployment-Agnostic Routing**: Root at localhost/staging/prod, subpath behind proxy (e.g., `/mxtk`)
- **Debug System**: Advanced error detection and theme validation tools
- **Testing Framework**: Comprehensive Puppeteer-based testing suite

### Content & Design
- **Complete Page Redesign**: All marketing pages with production-ready content
- **Team Integration**: Leadership profiles with actual team member images
- **Legal Framework**: Comprehensive Terms, Privacy Policy, and Disclosures
- **MXTK Cares Initiative**: Community-focused programs and nominations

### Technical Improvements
- **Hydration Fixes**: Resolved server/client rendering mismatches
- **Theme System**: Path-based mineral themes with consistent styling
- **Component Library**: Enhanced UI components with proper TypeScript types
- **Performance Optimization**: Improved loading and rendering efficiency

### Documentation (Consolidated)
- Updated testing docs to include the automated contrast audit
- Consolidated environment/proxy guidance (smart build + ngrok share)
- Deprecated the old basePath implementation doc (project is basePath-agnostic)

## Content status
Most pages now contain production-sounding copy. Sections labeled **(Sample)** will be replaced with signed docs and
live data. See `lib/placeholders.ts` to swap in proofs (IPFS CIDs + SHA256), oracle log entries, OTC aggregates,
and final addresses (token/pool/locker/multisig/timelock).

## Development Setup

### Environment Configuration

Before starting development, you need to configure environment variables for the MXTK pool auto-discovery system.

#### Required Environment Variables

Create or update your environment file with the following variables (preferred: `.env` managed by `./scripts/setup-mxtk-site.sh`, or `config/environments/.env.dev` for development):

```bash
# Required for on-chain reads (Arbitrum mainnet)
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/<YOUR_KEY>

# MXTK token address (Arbitrum mainnet)
MXTK_TOKEN_ADDRESS=0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba

# Optional manual pools (comma-separated) — can be blank
MXTK_POOLS=

# Auto-discovery on by default; you can disable with 0
AUTO_DISCOVER_POOLS=1

# Optional: restrict fee tiers or quote tokens (addresses)
# DISCOVERY_FEES=100,500,3000
# DISCOVERY_QUOTES=0xaf88d065e77c8cC2239327C5EDb3A432268e5831,0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9

# Optional indexer fallback (works out of the box)
DEXSCREENER_BASE=https://api.dexscreener.com/latest/dex

# Optional Uniswap v4 subgraph for TVL/volume
# UNISWAP_V4_SUBGRAPH_URL_ARBITRUM=https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v4-arbitrum

# Cache and stable token configuration
CACHE_TTL_SECONDS=45
STABLE_SYMBOLS=USDC,USDC.e,USDT,DAI
```

#### Getting an Arbitrum RPC URL

1. **Alchemy** (Recommended):
   - Sign up at [alchemy.com](https://alchemy.com)
   - Create a new app for Arbitrum mainnet
   - Copy the HTTPS endpoint URL
   - Replace `<YOUR_KEY>` in the `ARBITRUM_RPC_URL` with your actual key

2. **Alternative Providers**:
   - **Infura**: `https://arbitrum-mainnet.infura.io/v3/<YOUR_KEY>`
   - **QuickNode**: Use their Arbitrum endpoint
   - **Self-hosted**: Your own Arbitrum node

#### How Pool Auto-Discovery Works

The MXTK site automatically discovers Uniswap v4 pools through multiple sources:

1. **Factory Discovery**: Queries the Uniswap v4 factory contract to find pools between MXTK and configured quote tokens across all fee tiers
2. **Dexscreener Fallback**: Fetches pools from Dexscreener API as a backup source
3. **Manual Seeds**: Allows manual pool addresses from environment variables
4. **Deduplication**: Merges all sources and removes duplicates
5. **On-chain Data**: Reads pool state, token info, and price data from each discovered pool

#### Default Configuration

- **Quote Tokens**: USDC, USDC.e, USDT, DAI (Arbitrum mainnet)
- **Fee Tiers**: 0.01%, 0.05%, 0.3%, 1% (100, 500, 3000, 10000)
- **Cache TTL**: 45 seconds
- **Auto-discovery**: Enabled by default

#### API Endpoints

- `GET /api/pools` - Manual pools only
- `GET /api/pools?auto=1` - Auto-discovery enabled (default)
- `GET /api/pools?auto=0` - Manual pools only

#### Pool Table Display

The updated `PoolTable` component shows:
- **Source badge**: factory, dexscreener, or manual
- **Pool address**: Clickable Arbiscan link
- **Token pair**: Symbol/symbol format
- **Fee tier**: Percentage display
- **Approximate price**: MXTK/USD when paired with stables
- **24h metrics**: Volume, TVL, fees (requires subgraph)

### Quick Start
```bash
# Start development (root at http://localhost:2000)
./scripts/setup-mxtk-site.sh start

# Optional: expose through shared dev tunnel proxy at https://<domain>/mxtk
./scripts/setup-mxtk-site.sh share

# Smart build (detects what needs restart/rebuild)
./scripts/smart-build.sh apply

# Debugging tools
node tools/debug/debug.js

# Tests (see section below)
```

If you are integrating with an external proxy (ngrok/dev-proxy) or serving behind a prefix, see `docs/NGINX_PROXY_SETUP_GUIDE.md` for the full configuration and validation steps.

### Access Points
- **Development (root)**: http://localhost:2000
- **Dev Tunnel (subpath)**: https://<ngrok-domain>/mxtk
- **Ngrok Dashboard**: http://localhost:4040 (development only)

### Environment Management
```bash
# Start environment (use --env to select: development|staging|production)
./scripts/setup-mxtk-site.sh --env development start
./scripts/setup-mxtk-site.sh --env staging start
./scripts/setup-mxtk-site.sh --env production start

# Stop / Restart / Build / Logs / Status / Clean
./scripts/setup-mxtk-site.sh --env development stop
./scripts/setup-mxtk-site.sh --env development restart
./scripts/setup-mxtk-site.sh --env development build
./scripts/setup-mxtk-site.sh --env development logs
./scripts/setup-mxtk-site.sh --env development status
./scripts/setup-mxtk-site.sh --env development clean

# Setup or validate .env files
./scripts/setup-mxtk-site.sh setup-env
./scripts/setup-mxtk-site.sh validate-env

# Smart build: detect and apply required restarts/rebuilds
./scripts/smart-build.sh check
./scripts/smart-build.sh apply

# Shared tunnel (development only)
./scripts/setup-mxtk-site.sh share
./scripts/setup-mxtk-site.sh share --currenturl   # URL only (for scripting)
./scripts/setup-mxtk-site.sh share --updateurl   # Refresh and print URL

# Restart the ngrok service in Docker (if using static domains)
./scripts/setup-mxtk-site.sh restart-ngrok
```

### Shared Dev Proxy System (Development Only)
We support a shared dev proxy that exposes the app at a subpath (`/mxtk`) while the app itself remains root-based. To integrate with an external dev proxy (e.g., `dev-tunnel-proxy`):

```bash
# Start MXTK locally (bind-mounts, port 2000)
./scripts/setup-mxtk-site.sh start

# Install MXTK nginx snippet into the external dev proxy
DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh

# Connect MXTK containers to the shared ngrok network and print URL
./scripts/setup-mxtk-site.sh share

# Access via the proxy (if running): http(s)://<proxy-domain>/mxtk/
```

Notes:
1. The install script copies `config/dev-proxy/apps/mxtk.conf` into the proxy and reloads Nginx.
2. The share command attempts to auto-detect the ngrok URL and prints both direct and tunneled access points.

### Dev Tunnel Proxy (ngrok)
We support a shared dev proxy that exposes the app at a subpath (`/mxtk`). The app itself remains root-based.

Common commands:
```bash
# Start local app
./scripts/setup-mxtk-site.sh start

# Install nginx config into external dev-proxy (optional)
DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh

# Share current environment via ngrok
./scripts/setup-mxtk-site.sh share
```

### Ngrok Integration
- `./scripts/setup-mxtk-site.sh share` - Connect to shared network and show status
- `./scripts/setup-mxtk-site.sh share --currenturl` - Get current ngrok URL only (for scripting)
- `./scripts/setup-mxtk-site.sh share --updateurl` - Get ngrok URL and display access information
- `./scripts/setup-mxtk-site.sh restart-ngrok` - Restart the ngrok service container

### Docker Architecture
- **Development**: Internal network + optional ngrok-shared network + dev proxy system
- **Staging/Production**: Internal network only (production-ready)
- **Port Mapping**: 2000:2000 (external:internal) for all environments
- **Dev Proxy**: Port 8080 for shared proxy access
- **Ngrok**: Port 4040 for tunnel management
- **Health Checks**: Automatic container health monitoring

Guardrails:
- Builds are blocked if `next.config.js` defines `basePath` (see `scripts/guardrails/check-basepath.js`).

### Project Structure
```
mxtk-site/
├── app/                    # Next.js app router pages
├── components/             # React components and UI library
├── lib/                    # Utilities, configuration, and business logic
├── public/                 # Static assets and media files
├── scripts/                # Development and deployment scripts
├── tools/                  # Testing and debugging tools
│   ├── debug/             # Debugging and validation tools
│   └── test/              # Test suites and utilities
├── config/                 # Configuration files
│   ├── nginx-proxy.conf   # Nginx proxy configuration
│   ├── ngrok.yml          # Ngrok tunnel configuration
│   ├── environments/      # Optional env storage (.env.* files and templates)
│   └── docker/            # Docker compose configurations
│       ├── docker-compose.staging.yml
│       └── docker-compose.prod.yml
└── docs/                   # Documentation and design assets
```

### Development Tools
- **Debug System**: `node tools/debug/debug.js` - Theme/CSS variable checks, navigation, and error thresholds
- **Navigation Regression**: `npm run test:nav:localhost` and `npm run test:nav:ngrok`
- **Smart Build**: `./scripts/smart-build.sh status|check|apply` - Determines if restart/rebuild is needed
- **Puppeteer Tools**: See `tools/test/` and `tools/debug/`

### Traditional Development (for quick local checks only)
```bash
npm install
npm run dev           # root-based
npm run dev:proxy     # simulate /mxtk base path in dev
```
Note: Primary development is Docker-based (see PROJECT_RULES). Local runs are acceptable for quick checks but are not the supported workflow.

## Routing and Prefixing (Important)

- Do not use Next.js `basePath` or `assetPrefix`.
- Use helpers from `lib/routing/basePath.ts`:
  - `getRelativePath()` for internal navigation
  - `getPublicPath()` for public assets
  - `getApiPath()` for API routes
- These ensure links/assets work both at root and behind `/mxtk` via the proxy.

## Testing

```bash
# Localhost navigation
npm run test:nav:localhost

# Ngrok navigation (requires share running)
npm run test:nav:ngrok

# Generic (provide BASE_URL explicitly)
BASE_URL=http://localhost:2000 node tools/test/nav-regression.mjs
BASE_URL=https://<your-ngrok-domain>/mxtk node tools/test/nav-regression.mjs

# Crawl + Contrast Audit
BASE_URL=http://localhost:2000 node tools/test/crawl-regression.mjs
BASE_URL=https://<your-ngrok-domain>/mxtk node tools/test/crawl-regression.mjs

# Transparency screenshots and assertions (Wave 12.7)
BASE_URL=http://localhost:2000 node tools/test/transparency-screens.mjs

# Unit tests (includes cache TTL test)
npm run test:unit
```

The navigation tests verify:
- Absolute, prefix-correct links after hydration
- Header/footer navigation works via real clicks
- No console/network errors (benign dev warnings filtered)

## Development Guidelines

This project follows comprehensive development guidelines defined in `PROJECT_RULES.md`. These rules ensure:

- **Code Quality**: SOLID principles, DRY, and maintainable code
- **Testing**: Comprehensive testing with Jest and React Testing Library
- **Security**: Best practices for handling secrets and data validation
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized bundle sizes and efficient rendering

### AI Collaboration

The project is configured for effective AI collaboration with:
- **Project Rules**: `PROJECT_RULES.md` defines coding standards and enforcement
- **VS Code/Cursor**: Use tasks and these rules as guidance

### Quick Commands (VS Code Tasks)

Use VS Code tasks for common operations:
- `Ctrl+Shift+P` → "Tasks: Run Task" → Select from available tasks
- Tasks include: Start/Stop/Restart environment, Smart Build, Status check, Ngrok sharing

## 🤖 Sherpa AI & Knowledge Management

MXTK Sherpa is our intelligent AI assistant that helps users navigate the platform while protecting proprietary information through multi-layered safeguards.

### Key Features
- **Smart Content Protection**: Automated flagging and quarantine of sensitive information
- **Human-in-the-Loop Review**: Admin approval required for all vectorized content
- **Response Sanitization**: Real-time filtering of AI-generated responses
- **Transparent by Default**: Open information sharing with bulletproof proprietary protection

### Quick Access
- **Admin Interface**: `/admin` → Tools & Flags for content management
- **Knowledge Upload**: Use admin tools to safely ingest documents (DOCX, PDF, MD, TXT)
- **Safeguards Review**: Monitor and approve flagged content through `/admin/flags`

For complete documentation on safeguards architecture, content guidelines, and best practices, see:
**📖 [`docs/SHERPA_KNOWLEDGE_SAFEGUARDS.md`](docs/SHERPA_KNOWLEDGE_SAFEGUARDS.md)**

## Supporting Materials (handoff)

Drop assets here for incorporation:

- Logo: provide final transparent PNG or SVG to replace `/public/logo.png`.
- Proof docs (IPFS CIDs & hashes): update `lib/placeholders.ts`.
- On-chain addresses: replace placeholders in `lib/placeholders.ts` (token, pool, LP locker, multisig, timelock).
- Legal copy: edit under `app/(site)/legal/*`.
- Press/media: add files to `/public/media/` and link them from `app/(site)/media/page.tsx`.

This content previously lived in `docs/README.md` and is consolidated here.

## Docs index

- `docs/AUTOMATED_TESTING.md` – navigation regression, crawl + contrast audit
- `docs/DEV_TUNNEL_PROXY_INTEGRATION.md` – how the proxy + prefix setup works (no basePath)
- `docs/NGINX_PROXY_SETUP_GUIDE.md` – nginx configuration (prefix mount, internals)
- `docs/ENVIRONMENT_SWITCHING_SUMMARY.md` – smart build + sharing quick reference
- `docs/SIMULTANEOUS_ACCESS_GUIDE.md` – using localhost and `/mxtk` simultaneously
- `docs/ONCHAIN_SETUP.md` – RPC and pool discovery configuration
- `docs/SHERPA_KNOWLEDGE_SAFEGUARDS.md` – AI knowledge management, content safeguards, and best practices

## Subpath-aware development (localhost + ngrok)

- Set base path for dev:
  - Create `.env.development.local` with `NEXT_PUBLIC_BASE_PATH=/mxtk`
- Use helpers (never hardcode "/mxtk"):
  - Links: `<Link href="/route">` (Next applies basePath)
  - API: `getApiUrl('/ai/home/…')` or `getApiPath('/api/…')`
  - Assets: `withBase('/icons/…')` or `AppImage`
- Proxy: allow root `/_next/*` and HMR; do not use HTML `sub_filter` rewrites. See `docs/NGINX_PROXY_SETUP_GUIDE.md`.

## Testing quickstart

Install Chrome for Puppeteer (host):

```bash
npx puppeteer browsers install chrome
export PUPPETEER_EXECUTABLE_PATH="$HOME/.cache/puppeteer/chrome/…/Google Chrome for Testing"
```

Auditors:

```bash
# Console errors (localhost)
PATHS='/mxtk,/mxtk/dashboard' node tools/test/console-error-check.mjs http://localhost:2000
# Console errors (ngrok)
PATHS='/mxtk,/mxtk/dashboard' node tools/test/console-error-check.mjs https://<ngrok>/
# Grid drag/resize + persistence
BASE_URL=http://localhost:2000/mxtk node tools/test/dashboard-drag.mjs
BASE_URL=https://<ngrok>/mxtk node tools/test/dashboard-drag.mjs
```

See `docs/TESTING_GUIDE.md` for full details.

## Widgets grid (move/resize)

- Drag from widget header (`.wf-head`) with Sherpa open (`html.guide-open`).
- Resize via corner handles; changes persist to `/api/ai/home/:id`.
- Mobile forces one column; grid auto-stacks and persists positions.
- Tests: `tools/test/dashboard-drag.mjs` validates server persistence and no overlaps.

## Docs index (updated)

- `docs/TESTING_GUIDE.md` – auditors and E2E usage
- `docs/WIDGETS.md` – grid behavior and persistence
- `docs/NGINX_PROXY_SETUP_GUIDE.md` – single authoritative config for /mxtk + /_next/*
- `docs/SHERPA_KNOWLEDGE_SAFEGUARDS.md` – AI knowledge mgmt
