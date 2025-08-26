# MXTK Site Scripts

This directory contains utility scripts for managing the MXTK site development environment.

## 🚀 Development Scripts

### `setup-mxtk-site.sh`
**Purpose**: Initial setup and environment configuration
**Usage**: `./scripts/setup-mxtk-site.sh`
**Features**:
- Docker environment setup
- Dependencies installation
- Development server startup

### `smart-build.sh`
**Purpose**: Intelligent Docker container management
**Usage**: `./scripts/smart-build.sh [check|apply|status]`
**Features**:
- Detects file changes and determines rebuild needs
- Optimizes development workflow
- Manages Docker containers efficiently

## 🎨 Asset Management Scripts

### `find-logos.sh`
**Purpose**: Auto-download organization logos for development demos
**Usage**: 
- `./scripts/find-logos.sh` - Auto-download logos (default)
- `./scripts/find-logos.sh --instructions` - Show detailed instructions only
- `./scripts/find-logos.sh --help` - Show help

**Features**:
- **Auto-download mode**: Automatically finds and downloads logos
- **Instructions mode**: Detailed manual collection guide for marketing team
- **Multiple strategies**: Direct website, web search, generic logo generation
- **Dependency checking**: Ensures required tools are available
- **Progress tracking**: Shows download status and summary

**How it works**:
1. **Dependency Check**: Verifies curl, wget, and ImageMagick are installed
2. **Multi-Strategy Download**: 
   - Direct website logo URLs (hardcoded for known organizations)
   - Web search fallback (placeholder for search API integration)
   - Generic logo generation (SVG with initials and gradient)
3. **File Management**: Creates PNG files with correct naming convention
4. **Status Reporting**: Shows download progress and final summary
5. **Instructions Mode**: Provides detailed manual collection guide

**Download Strategies**:
- **Strategy 1**: Direct website scraping (for known organizations)
- **Strategy 2**: Web search integration (placeholder for future enhancement)
- **Strategy 3**: Generic SVG generation (fallback with organization initials)

**Organizations Covered**:
- **MXTK Cares (8)**: American Cancer Society, American Heart Association, March of Dimes, American Red Cross, Salvation Army, Habitat for Humanity, Doctors Without Borders, World Wildlife Fund
- **Ecosystem Partners (4)**: Persona, BitGo, Chainlink, Arbitrum

**Output Example**:
```
🔍 MXTK Organization Logo Finder
==================================
📋 Organizations that need logos:
🎗️  MXTK Cares Success Stories:
   • American Cancer Society - https://www.cancer.org
   • American Heart Association - https://www.heart.org
   ...
🔍 Checking for existing logos...
✅ Found 12 existing logo(s):
   • american-cancer-society.svg
   • american-heart-association.svg
   ...
```

### `create-placeholder-logos.sh`
**Purpose**: Creates temporary SVG placeholder logos
**Usage**: `./scripts/create-placeholder-logos.sh`
**Features**:
- Generates colored square placeholders with initials
- Prevents 404 errors while collecting real logos
- Category-coded colors (health, disaster, tech, etc.)
- Adds category labels to SVG files
- Creates 200x200px scalable vector graphics

**How it works**:
1. **SVG Generation**: Creates 12 SVG files with colored backgrounds
2. **Initials Display**: Uses organization initials as text overlay
3. **Category Coding**: Color-codes by organization type:
   - **Health**: Red tones (#d32f2f, #c62828, #e91e63)
   - **Disaster Relief**: Red tones (#f44336, #d32f2f)
   - **Housing**: Blue (#1976d2)
   - **Environment**: Green (#388e3c)
   - **Tech**: Purple/Blue/Orange (#9c27b0, #2196f3, #ff9800, #3f51b5)
4. **File Naming**: Matches expected filenames in `lib/placeholders.ts`
5. **Directory Creation**: Ensures `public/organizations/` exists

**Logo Workflow**:
```
For Developers (Auto-download):
1. ./scripts/find-logos.sh → Downloads "good enough" logos automatically
2. OrganizationLogo component → Displays logos immediately
3. Site ready for demo with real-looking logos

For Marketing Team (Manual collection):
1. ./scripts/find-logos.sh --instructions → Shows detailed guide
2. Manual logo collection from official sources
3. Replace auto-downloaded logos with official versions
4. OrganizationLogo component → Displays official logos

For Quick Setup (Placeholders):
1. ./scripts/create-placeholder-logos.sh → Creates temp SVGs
2. OrganizationLogo component → Shows colored initials
3. No 404 errors, ready for development
```

## 🔧 Utility Scripts

### `add-route.sh`
**Purpose**: Quick route addition helper
**Usage**: `./scripts/add-route.sh <route-name>`

### `manage-nginx-config.sh`
**Purpose**: Nginx configuration management
**Usage**: `./scripts/manage-nginx-config.sh`

### `ngrok-static-domain.sh`
**Purpose**: Ngrok static domain setup
**Usage**: `./scripts/ngrok-static-domain.sh`

## 📋 Workflow

### Initial Setup
```bash
./scripts/setup-mxtk-site.sh
```

### Daily Development
```bash
./scripts/smart-build.sh status  # Check environment
./scripts/smart-build.sh apply   # Apply changes
```

### Asset Management
```bash
./scripts/create-placeholder-logos.sh  # Create temp logos
./scripts/find-logos.sh               # Find real logos
```

## 🎯 Quick Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `setup-mxtk-site.sh` | Initial setup | First time setup |
| `smart-build.sh` | Development workflow | Daily development |
| `find-logos.sh` | Logo collection guide | When ready for real logos |
| `create-placeholder-logos.sh` | Temp logo creation | Fix 404 errors quickly |

## 🔄 Script Dependencies

- **Docker**: Required for development environment
- **Ngrok**: Required for external access
- **Bash**: All scripts are bash-compatible
- **Git**: For version control integration

## 📝 Notes

- All scripts use relative paths from project root
- Scripts are designed to be idempotent (safe to run multiple times)
- Error handling and logging included in all scripts
- Color-coded output for better readability

## 🔧 Technical Implementation

### Logo Scripts Architecture
```
lib/placeholders.ts → Defines organization data and logo paths
├── PLACEHOLDER_ORGANIZATIONS (8 orgs for MXTK Cares)
└── PLACEHOLDER_PARTNERS_ECOSYSTEM (4 orgs for Ecosystem)

components/OrganizationLogo.tsx → Displays individual logos
├── Fallback to initials if image fails
├── Responsive sizing (sm, md, lg)
└── Hover effects and accessibility

components/OrganizationLogoGrid.tsx → Grid layout for multiple logos
├── Renders organization arrays
├── Optional titles and subtitles
└── Clickable links to websites

scripts/find-logos.sh → Logo collection guidance
├── Hardcoded organization list (matches placeholders.ts)
├── Website and media kit URLs
└── File detection and status reporting

scripts/create-placeholder-logos.sh → Temporary logo creation
├── SVG generation with initials
├── Category-based color coding
└── Matches expected filenames
```

### File Dependencies
- **`lib/placeholders.ts`**: Source of truth for organization data
- **`public/organizations/`**: Target directory for logo files
- **`components/OrganizationLogo.tsx`**: Logo display component
- **`components/OrganizationLogoGrid.tsx`**: Grid layout component
