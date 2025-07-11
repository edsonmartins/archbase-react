#!/bin/bash

# Publish Individual Package to Verdaccio
# Usage: ./publish-individual.sh <package-name>

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ $# -eq 0 ]; then
  echo -e "${YELLOW}Usage: $0 <package-name>${NC}"
  echo -e "${YELLOW}Example: $0 core${NC}"
  exit 1
fi

PACKAGE_NAME="$1"
VERDACCIO_URL="http://192.168.1.110:4873"

echo -e "${BLUE}📦 Publishing @archbase/$PACKAGE_NAME to Verdaccio...${NC}"

# Check if package exists
if [ ! -d "packages/$PACKAGE_NAME" ]; then
  echo -e "${RED}❌ Package $PACKAGE_NAME not found${NC}"
  exit 1
fi

cd "packages/$PACKAGE_NAME"

# Check if dist exists
if [ ! -d "dist" ]; then
  echo -e "${YELLOW}⚠️  No dist folder found. Building package...${NC}"
  pnpm build
fi

# Get version
VERSION=$(node -p "require('./package.json').version")

# Create temp directory
TEMP_DIR=$(mktemp -d)

# Pack the package
echo -e "${YELLOW}📦 Packing @archbase/$PACKAGE_NAME...${NC}"
pnpm pack --pack-destination "$TEMP_DIR"

# Find the packed file
TARBALL="$TEMP_DIR/archbase-${PACKAGE_NAME}-${VERSION}.tgz"

if [ -f "$TARBALL" ]; then
  # Try to unpublish first
  npm unpublish "@archbase/$PACKAGE_NAME@$VERSION" --registry "$VERDACCIO_URL" --force 2>/dev/null || true
  sleep 1
  
  # Publish the tarball
  if npm publish "$TARBALL" --registry "$VERDACCIO_URL" --access public; then
    echo -e "${GREEN}✅ @archbase/$PACKAGE_NAME@$VERSION published successfully${NC}"
  else
    echo -e "${RED}❌ Failed to publish @archbase/$PACKAGE_NAME@$VERSION${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
  fi
else
  echo -e "${RED}❌ Tarball not found for @archbase/$PACKAGE_NAME${NC}"
  rm -rf "$TEMP_DIR"
  exit 1
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "${GREEN}🎉 Package published successfully!${NC}"