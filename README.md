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

## Content status
Most pages now contain production-sounding copy. Sections labeled **(Sample)** will be replaced with signed docs and
live data. See `lib/placeholders.ts` to swap in proofs (IPFS CIDs + SHA256), oracle log entries, OTC aggregates,
and final addresses (token/pool/locker/multisig/timelock).

## Development Setup

### Environment Configuration

Before starting development, you need to configure environment variables for the MXTK pool auto-discovery system.

#### Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

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

### Access Points
- **Development (root)**: http://localhost:2000
- **Dev Tunnel (subpath)**: https://<ngrok-domain>/mxtk
- **Ngrok Dashboard**: http://localhost:4040 (development only)

### Environment Management
```bash
# Switch environments
./scripts/setup-mxtk-site.sh switch dev|staging|prod

# Check status
./scripts/smart-build.sh status

# Apply changes
./scripts/smart-build.sh apply

# Connect to shared ngrok network (development only)
./scripts/setup-mxtk-site.sh share

# Get current ngrok URL only
./scripts/setup-mxtk-site.sh share --currenturl

# Update ngrok configuration and get URL
./scripts/setup-mxtk-site.sh share --updateurl

# Setup MXTK proxy route in shared ngrok
./scripts/setup-mxtk-site.sh proxy

### Shared Dev Proxy System (Development Only)
MXTK implements a **completely independent** shared dev proxy system that can work standalone OR integrate cooperatively with other projects:

#### **Independent Mode** (MXTK's own dev proxy)
```bash
# Setup MXTK's own dev proxy system
./scripts/setup-mxtk-site.sh setup-proxy

# Start MXTK with shared dev proxy
./scripts/setup-mxtk-site.sh start

# Access via: http://localhost:8080
```

#### **Cooperative External Proxy Sharing Mode**
```bash
# Start MXTK
./scripts/setup-mxtk-site.sh start

# Integrate with any project (universal approach)
DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh
./scripts/setup-mxtk-site.sh integrate-with other-project ../other-project

# Quick integrate with dev-tunnel-proxy (if in standard location)
./scripts/dev-proxy-install.sh

# Access via: http://localhost:8080/mxtk/
```

#### **Key Features**
1. **✅ Completely Independent**: MXTK can run its own dev proxy system
2. **✅ Universal Compatibility**: Works with ANY project using the shared pattern
3. **✅ No Dependencies**: Doesn't know about or depend on any specific project
4. **✅ Cooperative Integration**: Can integrate with any project's shared network
5. **✅ Flexible**: Supports both standalone and integrated modes
6. **✅ Scalable**: Easy to add new project integrations

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

### Ngrok Integration (Legacy)
The legacy ngrok integration is still available for backward compatibility:

- `./scripts/setup-mxtk-site.sh share` - Connect to shared network and show status
- `./scripts/setup-mxtk-site.sh share --currenturl` - Get current ngrok URL only (for scripting)
- `./scripts/setup-mxtk-site.sh share --updateurl` - Get ngrok URL and display access information

### Docker Architecture
- **Development**: Internal network + optional ngrok-shared network + dev proxy system
- **Staging/Production**: Internal network only (production-ready)
- **Port Mapping**: 2000:3000 (external:internal) for all environments
- **Dev Proxy**: Port 8080 for shared proxy access
- **Ngrok**: Port 4040 for tunnel management
- **Health Checks**: Automatic container health monitoring

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
│   ├── environments/      # Environment-specific configuration
│   │   ├── .env.dev       # Development environment variables
│   │   ├── .env.staging   # Staging environment variables
│   │   ├── .env.prod      # Production environment variables
│   │   └── *.template     # Environment file templates
│   └── docker/            # Docker compose configurations
│       ├── docker-compose.staging.yml
│       └── docker-compose.prod.yml
└── docs/                   # Documentation and design assets
```

### Development Tools
- **Debug System**: `node tools/debug/debug.js` - Comprehensive site validation
- **Navigation Regression**: `npm run test:nav:localhost` and `npm run test:nav:ngrok`
- **Puppeteer Tools**: See `tools/test/` and `tools/debug/`

### Traditional Development
```bash
pnpm install && pnpm dev
```

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
- **Cursor Rules**: `.cursorrules` file guides AI behavior
- **VS Code Integration**: Tasks and settings for seamless development
- **Project Rules**: `PROJECT_RULES.md` defines coding standards

### Quick Commands (VS Code Tasks)

Use VS Code tasks for common operations:
- `Ctrl+Shift+P` → "Tasks: Run Task" → Select from available tasks
- Tasks include: Start/Stop/Restart environment, Smart Build, Status check, Ngrok sharing
