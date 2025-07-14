#!/bin/bash

# Script para atualizar versão dos pacotes Archbase
# Uso: ./scripts/update-version.sh 3.0.2

set -e

if [ $# -eq 0 ]; then
    echo "❌ Erro: Versão não especificada"
    echo "💡 Uso: ./scripts/update-version.sh <nova-versao>"
    echo "📝 Exemplo: ./scripts/update-version.sh 3.0.2"
    exit 1
fi

NEW_VERSION=$1
echo "🚀 Atualizando todos os pacotes para versão $NEW_VERSION..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Lista de todos os pacotes
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

echo -e "${BLUE}📝 Atualizando versões nos package.json...${NC}"

# Atualizar versão em cada package.json
for package in "${PACKAGES[@]}"; do
  if [ -d "packages/$package" ]; then
    echo -e "${YELLOW}📦 Atualizando @archbase/$package...${NC}"
    
    # Atualizar versão do próprio pacote
    sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" "packages/$package/package.json"
    
    # Atualizar dependências @archbase dentro do pacote
    sed -i '' "s/\"@archbase\/\([^\"]*\)\": \"[^\"]*\"/\"@archbase\/\1\": \"$NEW_VERSION\"/g" "packages/$package/package.json"
    
    echo -e "${GREEN}✅ @archbase/$package atualizado para v$NEW_VERSION${NC}"
  else
    echo -e "${RED}❌ Pacote $package não encontrado${NC}"
  fi
done

echo ""
echo -e "${BLUE}🔨 Fazendo build de todos os pacotes...${NC}"
pnpm build

echo ""
echo -e "${BLUE}📦 Publicando pacotes no Verdaccio...${NC}"

VERDACCIO_URL="http://192.168.1.110:4873"
TEMP_DIR=$(mktemp -d)

for package in "${PACKAGES[@]}"; do
  if [ -d "packages/$package" ]; then
    echo -e "${YELLOW}📤 Publicando @archbase/$package@$NEW_VERSION...${NC}"
    cd "packages/$package"
    
    # Pack do pacote
    pnpm pack --pack-destination "$TEMP_DIR"
    
    # Unpublish versão anterior (se existir)
    npm unpublish "@archbase/$package@$NEW_VERSION" --registry "$VERDACCIO_URL" --force 2>/dev/null || true
    
    # Publish nova versão
    TARBALL="$TEMP_DIR/archbase-${package}-${NEW_VERSION}.tgz"
    if [ -f "$TARBALL" ]; then
      if npm publish "$TARBALL" --registry "$VERDACCIO_URL" --access public; then
        echo -e "${GREEN}✅ @archbase/$package@$NEW_VERSION publicado${NC}"
      else
        echo -e "${RED}❌ Falha ao publicar @archbase/$package@$NEW_VERSION${NC}"
      fi
    else
      echo -e "${RED}❌ Tarball não encontrado para @archbase/$package${NC}"
    fi
    
    cd ../..
  fi
done

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}🎉 Processo concluído!${NC}"
echo -e "${BLUE}📖 Para atualizar um projeto que usa os pacotes:${NC}"
echo "1. Edite o package.json do projeto para usar versão $NEW_VERSION"
echo "2. Execute: rm -rf node_modules pnpm-lock.yaml"
echo "3. Execute: pnpm install"
echo ""
echo -e "${YELLOW}💡 Exemplo de atualização no package.json do projeto:${NC}"
echo "\"@archbase/core\": \"^$NEW_VERSION\","
echo "\"@archbase/layout\": \"^$NEW_VERSION\","
echo "\"@archbase/security\": \"^$NEW_VERSION\","