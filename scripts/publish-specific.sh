#!/bin/bash

# Script para publicar pacotes específicos já buildados
# Uso: ./scripts/publish-specific.sh <versao> <pacote1> <pacote2> ...

set -e

if [ $# -lt 2 ]; then
    echo "❌ Erro: Parâmetros insuficientes"
    echo "💡 Uso: ./scripts/publish-specific.sh <versao> <pacote1> <pacote2> ..."
    echo "📝 Exemplo: ./scripts/publish-specific.sh 3.0.1 layout security admin"
    exit 1
fi

VERSION=$1
shift # Remove primeiro parâmetro (versão)
PACKAGES=("$@") # Resto dos parâmetros são os pacotes

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VERDACCIO_URL="http://192.168.1.110:4873"
TEMP_DIR=$(mktemp -d)

echo -e "${BLUE}📦 Publicando pacotes específicos versão $VERSION...${NC}"

for package in "${PACKAGES[@]}"; do
  if [ -d "packages/$package" ]; then
    echo -e "${YELLOW}📤 Publicando @archbase/$package@$VERSION...${NC}"
    cd "packages/$package"
    
    # Build individual do pacote
    echo -e "${YELLOW}🔨 Building @archbase/$package...${NC}"
    pnpm build
    
    # Pack do pacote
    pnpm pack --pack-destination "$TEMP_DIR"
    
    # Unpublish versão anterior (se existir)
    npm unpublish "@archbase/$package@$VERSION" --registry "$VERDACCIO_URL" --force 2>/dev/null || true
    
    # Publish nova versão
    TARBALL="$TEMP_DIR/archbase-${package}-${VERSION}.tgz"
    if [ -f "$TARBALL" ]; then
      if npm publish "$TARBALL" --registry "$VERDACCIO_URL" --access public; then
        echo -e "${GREEN}✅ @archbase/$package@$VERSION publicado${NC}"
      else
        echo -e "${RED}❌ Falha ao publicar @archbase/$package@$VERSION${NC}"
      fi
    else
      echo -e "${RED}❌ Tarball não encontrado para @archbase/$package${NC}"
    fi
    
    cd ../..
  else
    echo -e "${RED}❌ Pacote $package não encontrado${NC}"
  fi
done

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}🎉 Publicação concluída!${NC}"