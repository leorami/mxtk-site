# MXTK Site Update
- Light default; Dark toggle (persisted).
- Transparency hub: proofs (IPFS), oracle log, ops cost estimator, OTC aggregates, addresses, risk.
- Institutions page: Persona (KYC) and BitGo (escrow) placeholders.
- Replace placeholder data in `lib/placeholders.ts`.

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

# Optional Uniswap v3 subgraph for TVL/volume
# UNISWAP_V3_SUBGRAPH_URL_ARBITRUM=https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal

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

The MXTK site automatically discovers Uniswap v3 pools through multiple sources:

1. **Factory Discovery**: Queries the Uniswap v3 factory contract to find pools between MXTK and configured quote tokens across all fee tiers
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
# Start the development environment
./setup-mxtk-site.sh start

# Or use the smart build system
./smart-build.sh apply
```

### Access Points
- **Development**: http://localhost:2000
- **Staging**: http://localhost:2001  
- **Production**: http://localhost:2002
- **Ngrok Dashboard**: http://localhost:4040 (development only)

### Environment Management
```bash
# Switch environments
./setup-mxtk-site.sh switch dev|staging|prod

# Check status
./smart-build.sh status

# Apply changes
./smart-build.sh apply

# Connect to shared ngrok network (development only)
./setup-mxtk-site.sh share

# Get current ngrok URL only
./setup-mxtk-site.sh share --currenturl

# Update ngrok configuration and get URL
./setup-mxtk-site.sh share --updateurl

# Setup MXTK proxy route in shared ngrok
./setup-mxtk-site.sh proxy

### Shared Dev Proxy System (Development Only)
MXTK implements a **completely independent** shared dev proxy system that can work standalone OR integrate cooperatively with other projects:

#### **Independent Mode** (MXTK's own dev proxy)
```bash
# Setup MXTK's own dev proxy system
./setup-mxtk-site.sh setup-proxy

# Start MXTK with shared dev proxy
./setup-mxtk-site.sh start

# Access via: http://localhost:8080
```

#### **Cooperative External Proxy Sharing Mode**
```bash
# Start MXTK
./setup-mxtk-site.sh start

# Integrate with any project (universal approach)
./setup-mxtk-site.sh integrate-with encast-web ../encast.web
./setup-mxtk-site.sh integrate-with other-project ../other-project

# Quick integrate with encast-web (if in standard location)
./setup-mxtk-site.sh integrate-encast

# Access via: http://localhost:8080/mxtk/
```

#### **Key Features**
1. **✅ Completely Independent**: MXTK can run its own dev proxy system
2. **✅ Universal Compatibility**: Works with ANY project using the shared pattern
3. **✅ No Dependencies**: Doesn't know about or depend on any specific project
4. **✅ Cooperative Integration**: Can integrate with any project's shared network
5. **✅ Flexible**: Supports both standalone and integrated modes
6. **✅ Scalable**: Easy to add new project integrations

### Dev Proxy Command Options
- `./setup-mxtk-site.sh setup-proxy` - Setup MXTK's own dev proxy system
- `./setup-mxtk-site.sh stop-proxy` - Stop dev proxy services
- `./setup-mxtk-site.sh restart-proxy` - Restart dev proxy services
- `./setup-mxtk-site.sh integrate-with <project> <dir>` - Integrate with any project
- `./setup-mxtk-site.sh disconnect-from <project> <dir>` - Disconnect from project
- `./setup-mxtk-site.sh integrate-encast [dir]` - Quick integrate with encast-web
- `./setup-mxtk-site.sh disconnect-encast [dir]` - Quick disconnect from encast-web

### Ngrok Integration (Legacy)
The legacy ngrok integration is still available for backward compatibility:

- `./setup-mxtk-site.sh share` - Connect to shared network and show status
- `./setup-mxtk-site.sh share --currenturl` - Get current ngrok URL only (for scripting)
- `./setup-mxtk-site.sh share --updateurl` - Get ngrok URL and display access information

### Docker Architecture
- **Development**: Internal network + optional ngrok-shared network + dev proxy system
- **Staging/Production**: Internal network only (production-ready)
- **Port Mapping**: 2000:3000 (external:internal) for all environments
- **Dev Proxy**: Port 8080 for shared proxy access
- **Ngrok**: Port 4040 for tunnel management
- **Health Checks**: Automatic container health monitoring

### Traditional Development
```bash
pnpm install && pnpm dev
```

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
