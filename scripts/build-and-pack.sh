#!/bin/bash

# Build and Pack Script for Archbase React v3
# This script builds all packages and creates tarballs for local installation

set -e  # Exit on any error

echo "🚀 Starting Archbase React v3 build and packaging process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create dist-packages directory if it doesn't exist
echo -e "${BLUE}📁 Creating dist-packages directory...${NC}"
mkdir -p dist-packages

# Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
pnpm turbo clean

# Build all packages
echo -e "${BLUE}🔨 Building all packages...${NC}"
pnpm build

# Package order (respecting dependencies)
PACKAGES=(
  "core"
  "data" 
  "components"
  "layout"
  "security"
  "admin"
  "advanced"
  "template"
  "tools"
  "ssr"
)

echo -e "${BLUE}📦 Packaging all packages...${NC}"

# Pack each package
for package in "${PACKAGES[@]}"; do
  if [ -d "packages/$package" ]; then
    echo -e "${YELLOW}📦 Packaging @archbase/$package...${NC}"
    cd "packages/$package"
    pnpm pack --pack-destination ../../dist-packages
    cd ../..
    echo -e "${GREEN}✅ @archbase/$package packaged successfully${NC}"
  else
    echo -e "${RED}❌ Package $package not found${NC}"
  fi
done

# List created packages
echo -e "${BLUE}📋 Created packages:${NC}"
ls -la dist-packages/

# Calculate total size
TOTAL_SIZE=$(du -sh dist-packages/ | cut -f1)
echo -e "${GREEN}🎉 Build and packaging completed successfully!${NC}"
echo -e "${GREEN}📊 Total package size: $TOTAL_SIZE${NC}"

echo ""
echo -e "${BLUE}📖 Usage Instructions:${NC}"
echo "To install packages in another project:"
echo ""
echo "# Install individual packages:"
echo "npm install $(pwd)/dist-packages/archbase-core-3.0.0.tgz"
echo "npm install $(pwd)/dist-packages/archbase-data-3.0.0.tgz"
echo ""
echo "# Or install all packages:"
echo "npm install $(pwd)/dist-packages/archbase-*.tgz"
echo ""
echo -e "${GREEN}✨ Ready for local installation!${NC}"