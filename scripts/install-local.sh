#!/bin/bash

# Install Local Packages Script for Archbase React v3
# This script helps install the packaged library in another project

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the current directory (where the packages are)
PACKAGE_DIR=$(pwd)/dist-packages

# Check if dist-packages directory exists
if [ ! -d "$PACKAGE_DIR" ]; then
  echo -e "${RED}❌ Error: dist-packages directory not found!${NC}"
  echo -e "${YELLOW}💡 Run ./build-and-pack.sh first to create the packages${NC}"
  exit 1
fi

# Check if we have a target directory argument
if [ $# -eq 0 ]; then
  echo -e "${YELLOW}📖 Usage: $0 <target-project-directory>${NC}"
  echo ""
  echo "Example:"
  echo "  $0 /path/to/my/project"
  echo "  $0 ../my-react-app"
  echo ""
  echo -e "${BLUE}Available packages:${NC}"
  ls -1 "$PACKAGE_DIR"/*.tgz 2>/dev/null | sed 's/.*\//  - /' || echo "  No packages found"
  exit 1
fi

TARGET_DIR="$1"

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${RED}❌ Error: Target directory '$TARGET_DIR' does not exist!${NC}"
  exit 1
fi

# Check if target directory has package.json
if [ ! -f "$TARGET_DIR/package.json" ]; then
  echo -e "${RED}❌ Error: '$TARGET_DIR' is not a valid Node.js project (no package.json found)!${NC}"
  exit 1
fi

echo -e "${BLUE}🚀 Installing Archbase React v3 packages to $TARGET_DIR${NC}"

# Change to target directory
cd "$TARGET_DIR"

# List available packages
PACKAGES=($(ls "$PACKAGE_DIR"/archbase-*.tgz 2>/dev/null))

if [ ${#PACKAGES[@]} -eq 0 ]; then
  echo -e "${RED}❌ No Archbase packages found in $PACKAGE_DIR${NC}"
  exit 1
fi

echo -e "${BLUE}📦 Found ${#PACKAGES[@]} packages to install:${NC}"
for package in "${PACKAGES[@]}"; do
  echo "  - $(basename "$package")"
done

echo ""
read -p "$(echo -e "${YELLOW}❓ Do you want to install all packages? (y/N): ${NC}")" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}📦 Installing all Archbase packages...${NC}"
  
  # Install peer dependencies first
  echo -e "${YELLOW}📦 Installing peer dependencies...${NC}"
  npm install react react-dom @mantine/core @mantine/hooks @mantine/form @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/emotion @mantine/tiptap @tabler/icons-react
  
  # Install Archbase packages
  for package in "${PACKAGES[@]}"; do
    echo -e "${YELLOW}📦 Installing $(basename "$package")...${NC}"
    npm install "$package"
  done
  
  echo -e "${GREEN}🎉 All Archbase React v3 packages installed successfully!${NC}"
  echo ""
  echo -e "${BLUE}📖 Next steps:${NC}"
  echo "1. Import components in your code:"
  echo "   import { ArchbaseEdit, ArchbaseButton } from '@archbase/components';"
  echo "   import { useArchbaseDataSource } from '@archbase/data';"
  echo ""
  echo "2. Setup providers in your app:"
  echo "   import { ArchbaseGlobalProvider } from '@archbase/core';"
  echo ""
  echo -e "${GREEN}✨ Happy coding with Archbase React v3!${NC}"
else
  echo -e "${BLUE}📦 Installation cancelled.${NC}"
  echo ""
  echo -e "${YELLOW}💡 To install manually:${NC}"
  for package in "${PACKAGES[@]}"; do
    echo "  npm install $package"
  done
fi