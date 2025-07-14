#!/bin/bash

# Script para teste rápido do projeto demo v2
PROJECT_PATH="/Users/edsonmartins/tmp/rapidex-manager-admin-v2"

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}⚡ Teste rápido do projeto demo v2...${NC}"

# Change to project directory
cd "$PROJECT_PATH"

echo -e "${YELLOW}📝 Verificando tipagem...${NC}"
pnpm type-check

echo -e "${GREEN}✅ Tipagem OK! Projeto demo v2 funcionando!${NC}"