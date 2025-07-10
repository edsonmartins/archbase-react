#!/bin/bash

# Configure Verdaccio Private Registry for Archbase React v3
# This script configures pnpm to use a private Verdaccio registry

set -e  # Exit on any error

echo "🔧 Configuring Verdaccio private registry for Archbase React v3..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default Verdaccio server (can be overridden)
VERDACCIO_URL=${1:-"http://192.168.1.110:4873"}

echo -e "${BLUE}📡 Verdaccio server: $VERDACCIO_URL${NC}"

# Configure pnpm registry for @archbase scope
echo -e "${YELLOW}🔧 Configuring pnpm registry for @archbase scope...${NC}"
pnpm config set @archbase:registry "$VERDACCIO_URL"

# Verify configuration
echo -e "${BLUE}📋 Current pnpm configuration:${NC}"
echo "Global registry: $(pnpm config get registry)"
echo "@archbase registry: $(pnpm config get @archbase:registry)"

# Test connection to Verdaccio
echo -e "${YELLOW}🔍 Testing connection to Verdaccio...${NC}"
if curl -s "$VERDACCIO_URL" > /dev/null; then
    echo -e "${GREEN}✅ Connection to Verdaccio successful!${NC}"
else
    echo -e "${RED}❌ Cannot connect to Verdaccio at $VERDACCIO_URL${NC}"
    echo -e "${YELLOW}💡 Make sure Verdaccio is running and accessible${NC}"
    exit 1
fi

# Create .npmrc file for the project
echo -e "${YELLOW}📝 Creating .npmrc file...${NC}"
cat > .npmrc << EOF
@archbase:registry=$VERDACCIO_URL
EOF

echo -e "${GREEN}✅ .npmrc file created successfully!${NC}"

# Show next steps
echo ""
echo -e "${BLUE}📖 Next steps:${NC}"
echo "1. To publish packages, use:"
echo "   ./publish-verdaccio.sh"
echo ""
echo "2. To install from Verdaccio in other projects:"
echo "   pnpm config set @archbase:registry $VERDACCIO_URL"
echo "   pnpm install @archbase/core"
echo ""
echo -e "${GREEN}🎉 Verdaccio configuration completed!${NC}"