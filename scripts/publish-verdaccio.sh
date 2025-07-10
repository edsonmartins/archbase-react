#!/bin/bash

# Fixed Publish to Verdaccio Script
# This script handles workspace dependencies correctly

set -e  # Exit on any error

echo "🚀 Publishing Archbase React v3 packages to Verdaccio..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

VERDACCIO_URL="http://192.168.1.110:4873"

echo -e "${BLUE}📡 Publishing to: $VERDACCIO_URL${NC}"

# First, make sure all packages are built with current workspace setup
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pnpm install

echo -e "${BLUE}🔨 Building all packages with workspace dependencies...${NC}"
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

echo -e "${BLUE}📦 Publishing packages using pnpm pack method...${NC}"

# Create temp directory for packed files
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}📁 Using temp directory: $TEMP_DIR${NC}"

# Pack and publish each package
for package in "${PACKAGES[@]}"; do
  if [ -d "packages/$package" ]; then
    echo -e "${YELLOW}📦 Processing @archbase/$package...${NC}"
    cd "packages/$package"
    
    # Check if package has a dist folder
    if [ ! -d "dist" ]; then
      echo -e "${RED}❌ No dist folder found for $package. Build may have failed.${NC}"
      cd ../..
      continue
    fi
    
    # Get version
    VERSION=$(node -p "require('./package.json').version")
    
    # Pack the package (this resolves workspace dependencies)
    echo -e "${YELLOW}📦 Packing @archbase/$package...${NC}"
    pnpm pack --pack-destination "$TEMP_DIR"
    
    # Find the packed file
    TARBALL="$TEMP_DIR/archbase-${package}-${VERSION}.tgz"
    
    if [ -f "$TARBALL" ]; then
      # Try to unpublish first
      npm unpublish "@archbase/$package@$VERSION" --registry "$VERDACCIO_URL" --force 2>/dev/null || true
      sleep 1
      
      # Publish the tarball
      if npm publish "$TARBALL" --registry "$VERDACCIO_URL" --access public; then
        echo -e "${GREEN}✅ @archbase/$package@$VERSION published successfully${NC}"
      else
        echo -e "${RED}❌ Failed to publish @archbase/$package@$VERSION${NC}"
      fi
    else
      echo -e "${RED}❌ Tarball not found for @archbase/$package${NC}"
    fi
    
    cd ../..
    echo ""
  else
    echo -e "${RED}❌ Package $package not found${NC}"
  fi
done

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "${GREEN}🎉 Publishing process completed!${NC}"
echo ""
echo -e "${BLUE}📖 To install packages from Verdaccio:${NC}"
echo "npm config set @archbase:registry $VERDACCIO_URL"
echo "npm install @archbase/core @archbase/components @archbase/data"
echo ""
echo -e "${YELLOW}💡 Or in your project's .npmrc:${NC}"
echo "@archbase:registry=$VERDACCIO_URL"
echo ""
echo -e "${GREEN}✨ Packages are now available without workspace references!${NC}"