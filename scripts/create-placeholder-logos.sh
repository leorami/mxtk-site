#!/bin/bash

# =============================================================================
# CREATE PLACEHOLDER LOGOS
# 
# Creates simple SVG placeholder logos for organizations to prevent 404 errors
# while real logos are being collected. These are colored squares with initials.
# 
# Usage:
#   ./scripts/create-placeholder-logos.sh
# 
# To get real logos later:
#   ./scripts/find-logos.sh
# =============================================================================

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORGANIZATIONS_DIR="$PROJECT_ROOT/public/organizations"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 Creating placeholder logos for organizations...${NC}"

# Create organizations directory
mkdir -p "$ORGANIZATIONS_DIR"

# Function to create a simple SVG placeholder logo
create_placeholder_logo() {
    local filename="$1"
    local initials="$2"
    local color="$3"
    local category="$4"
    
    cat > "$ORGANIZATIONS_DIR/${filename}.svg" << EOF
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}" rx="20"/>
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="white">${initials}</text>
  <text x="100" y="180" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="white" opacity="0.8">${category}</text>
</svg>
EOF
}

echo -e "${YELLOW}📋 Creating MXTK Cares organization logos...${NC}"

# Create placeholder logos for MXTK Cares organizations
create_placeholder_logo "american-cancer-society" "AC" "#d32f2f" "health"
create_placeholder_logo "american-heart-association" "AH" "#c62828" "health"
create_placeholder_logo "march-of-dimes" "MD" "#e91e63" "health"
create_placeholder_logo "american-red-cross" "AR" "#f44336" "disaster"
create_placeholder_logo "salvation-army" "SA" "#d32f2f" "disaster"
create_placeholder_logo "habitat-for-humanity" "HH" "#1976d2" "housing"
create_placeholder_logo "doctors-without-borders" "DW" "#388e3c" "health"
create_placeholder_logo "world-wildlife-fund" "WW" "#388e3c" "environment"

echo -e "${YELLOW}📋 Creating ecosystem partner logos...${NC}"

# Create placeholder logos for ecosystem partners
create_placeholder_logo "persona" "P" "#9c27b0" "kyc"
create_placeholder_logo "bitgo" "B" "#2196f3" "custody"
create_placeholder_logo "chainlink" "C" "#ff9800" "oracle"
create_placeholder_logo "arbitrum" "A" "#3f51b5" "blockchain"

echo -e "${GREEN}✅ Created 12 placeholder logos in $ORGANIZATIONS_DIR${NC}"
echo ""

echo -e "${BLUE}📋 Placeholder logos created:${NC}"
echo "   ${YELLOW}MXTK Cares:${NC} american-cancer-society, american-heart-association, march-of-dimes,"
echo "               american-red-cross, salvation-army, habitat-for-humanity,"
echo "               doctors-without-borders, world-wildlife-fund"
echo "   ${YELLOW}Ecosystem:${NC}  persona, bitgo, chainlink, arbitrum"
echo ""

echo -e "${BLUE}🎨 Logo Features:${NC}"
echo "   • Colored squares with organization initials"
echo "   • Category labels (health, disaster, tech, etc.)"
echo "   • 200x200px SVG format for crisp scaling"
echo "   • Automatic fallback in OrganizationLogo component"
echo ""

echo -e "${YELLOW}⚠️  These are temporary placeholders!${NC}"
echo "   Replace them with actual logos when available."
echo ""

echo -e "${BLUE}🔗 Next Steps:${NC}"
echo "   • Test the site - 404 errors should be gone"
echo "   • Check organization sections for colored logos"
echo "   • When ready for real logos: ./scripts/find-logos.sh"
echo ""

# Verify the files were created
echo -e "${BLUE}🔍 Verifying created files:${NC}"
ls -la "$ORGANIZATIONS_DIR"/*.svg | wc -l | xargs echo "   Total SVG files:"
echo ""

echo -e "${GREEN}🚀 Ready to use!${NC}"
