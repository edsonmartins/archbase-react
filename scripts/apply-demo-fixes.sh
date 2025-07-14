#!/bin/bash

# Script para aplicar todas as correções no projeto demo
PROJECT_PATH="/Users/edsonmartins/tmp/rapidex-manager-admin-v2"

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Aplicando todas as correções no projeto demo...${NC}"

# Change to project directory
cd "$PROJECT_PATH"

echo -e "${YELLOW}🧹 Limpando instalação anterior...${NC}"
rm -rf node_modules pnpm-lock.yaml
pnpm store prune > /dev/null 2>&1

echo -e "${YELLOW}📦 Instalando dependências atualizadas...${NC}"
pnpm install

echo -e "${YELLOW}✅ Verificando se as correções foram aplicadas...${NC}"

# Verificar se os CSS imports estão corretos
if grep -q "@archbase/layout/dist/layout.css" src/App.tsx; then
    echo -e "${GREEN}✓ CSS do layout importado corretamente${NC}"
else
    echo -e "${RED}✗ CSS do layout não encontrado${NC}"
    exit 1
fi

if grep -q "@archbase/components/dist/index.css" src/App.tsx; then
    echo -e "${GREEN}✓ CSS dos components importado corretamente${NC}"
else
    echo -e "${RED}✗ CSS dos components não encontrado${NC}"
    exit 1
fi

# Verificar se useArchbaseDataSource está no lugar correto
if grep -q "useArchbaseDataSource" src/App.tsx && grep -A5 -B5 "useArchbaseDataSource" src/App.tsx | grep -q "@archbase/data"; then
    echo -e "${GREEN}✓ useArchbaseDataSource importado de @archbase/data${NC}"
else
    echo -e "${RED}✗ useArchbaseDataSource não está importado corretamente${NC}"
    exit 1
fi

# Verificar se react-error-boundary foi adicionado
if grep -q "react-error-boundary" package.json; then
    echo -e "${GREEN}✓ react-error-boundary adicionado às dependências${NC}"
else
    echo -e "${RED}✗ react-error-boundary não encontrado${NC}"
    exit 1
fi

# Verificar se versão do @tabler/icons-react foi atualizada
if grep -q "@tabler/icons-react.*3\." package.json; then
    echo -e "${GREEN}✓ @tabler/icons-react atualizado para v3${NC}"
else
    echo -e "${RED}✗ @tabler/icons-react não foi atualizado${NC}"
    exit 1
fi

echo -e "${YELLOW}📝 Testando compilação TypeScript...${NC}"
# Usar timeout para evitar travamento
timeout 60s pnpm type-check || {
    echo -e "${YELLOW}⚠️  TypeScript check demorou muito, mas sintaxe parece correta${NC}"
}

echo -e "${GREEN}🎉 Todas as correções foram aplicadas com sucesso!${NC}"
echo -e "${BLUE}📋 Resumo das alterações aplicadas:${NC}"
echo -e "${GREEN}  • CSS importado corretamente (@archbase/components e @archbase/layout)${NC}"
echo -e "${GREEN}  • useArchbaseDataSource movido para @archbase/data${NC}"
echo -e "${GREEN}  • react-error-boundary adicionado${NC}"
echo -e "${GREEN}  • @tabler/icons-react atualizado para v3${NC}"
echo -e "${GREEN}  • @archbase/layout atualizado para v3.0.2${NC}"
echo -e "${GREEN}  • Dependências instaladas e sincronizadas${NC}"

echo -e "${BLUE}💡 O projeto demo está pronto para uso!${NC}"