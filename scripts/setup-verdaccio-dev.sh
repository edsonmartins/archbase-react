#!/bin/bash

# Setup Verdaccio for Development (No Authentication)
# This script creates a user and token for development

set -e  # Exit on any error

echo "🔧 Setting up Verdaccio for development..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

VERDACCIO_URL="http://192.168.1.110:4873"

# Create a development user automatically
echo -e "${YELLOW}🔑 Creating development user...${NC}"

# Create .npmrc with auth token
echo -e "${YELLOW}📝 Setting up authentication...${NC}"

# Try to login with default dev credentials
expect -c "
spawn npm adduser --registry $VERDACCIO_URL
expect \"Username:\"
send \"edsonmartins\r\"
expect \"Password:\"
send \"727204\r\"
expect \"Email:\"
send \"edsonmartins@archbase.com\r\"
expect eof
" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Could not auto-login. Please login manually:${NC}"
    echo -e "${BLUE}Run: npm adduser --registry $VERDACCIO_URL${NC}"
    echo -e "${BLUE}Username: dev${NC}"
    echo -e "${BLUE}Password: dev123${NC}"
    echo -e "${BLUE}Email: dev@archbase.com${NC}"
}

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}📖 If auto-login failed, manually run:${NC}"
echo "npm adduser --registry $VERDACCIO_URL"
echo ""
echo -e "${YELLOW}💡 Or configure Verdaccio server to allow anonymous publish:${NC}"
echo "1. Edit Verdaccio config.yaml"
echo "2. Set '@archbase/*': publish: \$all"
echo "3. Restart Verdaccio"