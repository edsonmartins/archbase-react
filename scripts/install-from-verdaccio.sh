#!/bin/bash

# Install from Verdaccio Private Registry Script
# This script helps install Archbase packages from Verdaccio in other projects

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default Verdaccio server (can be overridden)
VERDACCIO_URL=${1:-"http://192.168.1.110:4873"}

# Check if we have a target directory argument
if [ $# -eq 0 ]; then
  echo -e "${YELLOW}📖 Usage: $0 [verdaccio-url] <target-project-directory>${NC}"
  echo ""
  echo "Examples:"
  echo "  $0 /path/to/my/project                              # Uses default Verdaccio"
  echo "  $0 http://192.168.1.110:4873 /path/to/my/project   # Custom Verdaccio URL"
  echo ""
  exit 1
fi

# If two arguments, first is URL, second is target directory
if [ $# -eq 2 ]; then
  VERDACCIO_URL="$1"
  TARGET_DIR="$2"
else
  TARGET_DIR="$1"
fi

echo -e "${BLUE}🚀 Installing Archbase React v3 from Verdaccio${NC}"
echo -e "${BLUE}📡 Verdaccio server: $VERDACCIO_URL${NC}"
echo -e "${BLUE}🎯 Target directory: $TARGET_DIR${NC}"

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

# Test connection to Verdaccio
echo -e "${YELLOW}🔍 Testing connection to Verdaccio...${NC}"
if ! curl -s "$VERDACCIO_URL" > /dev/null; then
    echo -e "${RED}❌ Cannot connect to Verdaccio at $VERDACCIO_URL${NC}"
    echo -e "${YELLOW}💡 Make sure Verdaccio is running and accessible${NC}"
    exit 1
fi

# Change to target directory
cd "$TARGET_DIR"

# Configure pnpm registry for @archbase scope
echo -e "${YELLOW}🔧 Configuring pnpm registry for @archbase scope...${NC}"
pnpm config set @archbase:registry "$VERDACCIO_URL"

# Create or update .npmrc file
echo -e "${YELLOW}📝 Creating/updating .npmrc file...${NC}"
if [ -f ".npmrc" ]; then
  # Remove existing @archbase registry config
  sed -i.bak '/^@archbase:registry=/d' .npmrc
fi
echo "@archbase:registry=$VERDACCIO_URL" >> .npmrc

# Available packages
PACKAGES=(
  "@archbase/core"
  "@archbase/data"
  "@archbase/components"
  "@archbase/layout"
  "@archbase/security"
  "@archbase/admin"
  "@archbase/advanced"
  "@archbase/template"
  "@archbase/tools"
  "@archbase/ssr"
)

echo -e "${BLUE}📦 Available Archbase packages:${NC}"
for package in "${PACKAGES[@]}"; do
  echo "  - $package"
done

echo ""
read -p "$(echo -e "${YELLOW}❓ Do you want to install all packages? (y/N): ${NC}")" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}📦 Installing all Archbase packages...${NC}"
  
  # Install peer dependencies first
  echo -e "${YELLOW}📦 Installing peer dependencies...${NC}"
  pnpm install react react-dom @mantine/core @mantine/hooks @mantine/form @mantine/dates @mantine/notifications @mantine/modals @mantine/spotlight @mantine/dropzone @mantine/emotion @mantine/tiptap @tabler/icons-react
  
  # Install Archbase packages
  for package in "${PACKAGES[@]}"; do
    echo -e "${YELLOW}📦 Installing $package...${NC}"
    if pnpm install "$package"; then
      echo -e "${GREEN}✅ $package installed successfully${NC}"
    else
      echo -e "${RED}❌ Failed to install $package${NC}"
    fi
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
    echo "  pnpm install $package"
  done
fi