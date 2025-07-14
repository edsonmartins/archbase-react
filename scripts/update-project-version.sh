#!/bin/bash

# Script para atualizar versão dos pacotes @archbase em um projeto específico
# Uso: ./scripts/update-project-version.sh <caminho-do-projeto> <nova-versao>

set -e

if [ $# -lt 2 ]; then
    echo "❌ Erro: Parâmetros insuficientes"
    echo "💡 Uso: ./scripts/update-project-version.sh <caminho-do-projeto> <nova-versao>"
    echo "📝 Exemplo: ./scripts/update-project-version.sh /path/to/project 3.0.2"
    exit 1
fi

PROJECT_PATH=$1
NEW_VERSION=$2

if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Erro: Diretório do projeto não encontrado: $PROJECT_PATH"
    exit 1
fi

if [ ! -f "$PROJECT_PATH/package.json" ]; then
    echo "❌ Erro: package.json não encontrado em: $PROJECT_PATH"
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Atualizando projeto em: $PROJECT_PATH${NC}"
echo -e "${BLUE}📝 Nova versão: $NEW_VERSION${NC}"

cd "$PROJECT_PATH"

echo -e "${YELLOW}📝 Atualizando package.json...${NC}"

# Atualizar todas as dependências @archbase no package.json
sed -i '' "s/\"@archbase\/\([^\"]*\)\": \"[^\"]*\"/\"@archbase\/\1\": \"^$NEW_VERSION\"/g" package.json

echo -e "${YELLOW}🧹 Limpando cache e dependências...${NC}"

# Limpar node_modules e lock file
rm -rf node_modules pnpm-lock.yaml 2>/dev/null || true

echo -e "${YELLOW}📦 Reinstalando dependências...${NC}"

# Reinstalar dependências
pnpm install --ignore-workspace

echo -e "${GREEN}✅ Projeto atualizado com sucesso para versão $NEW_VERSION!${NC}"
echo ""
echo -e "${BLUE}📋 Resumo das alterações:${NC}"
grep "@archbase" package.json || echo "Nenhuma dependência @archbase encontrada"