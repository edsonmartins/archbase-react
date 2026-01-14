#!/bin/bash
# Script para criar release e publicar no NPM
# Uso: ./scripts/release.sh [major|minor|patch|x.x.x]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Archbase React - Release Script     ${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Verificar se está na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}Erro: Você deve estar na branch 'main' para fazer release.${NC}"
    echo "Branch atual: $CURRENT_BRANCH"
    exit 1
fi

# Verificar se não há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}Erro: Existem mudanças não commitadas.${NC}"
    echo "Faça commit das mudanças antes de fazer release."
    git status --short
    exit 1
fi

# Verificar se está atualizado com origin
echo -e "${BLUE}Verificando atualização com origin...${NC}"
git fetch origin
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
    echo -e "${RED}Erro: Branch local não está atualizada com origin/main.${NC}"
    echo "Execute: git pull origin main"
    exit 1
fi

# Determinar tipo de versionamento
VERSION_TYPE=${1:-patch}

case $VERSION_TYPE in
    major|minor|patch|x.x.x)
        ;;
    *)
        echo -e "${RED}Erro: Tipo de versão inválido.${NC}"
        echo "Uso: $0 [major|minor|patch|x.x.x]"
        echo ""
        echo "Exemplos:"
        echo "  $0 patch    # 3.0.0 -> 3.0.1"
        echo "  $0 minor    # 3.0.0 -> 3.1.0"
        echo "  $0 major    # 3.0.0 -> 4.0.0"
        echo "  $0 3.1.5    # versão específica"
        exit 1
        ;;
esac

# Obter versão atual
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Versão atual:${NC} $CURRENT_VERSION"

# Calcular nova versão
if [ "$VERSION_TYPE" = "x.x.x" ]; then
    shift
    NEW_VERSION=$1
    if [ -z "$NEW_VERSION" ]; then
        echo -e "${RED}Erro: Versão específica não fornecida.${NC}"
        exit 1
    fi
else
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version | sed 's/^v//')
fi

echo -e "${GREEN}Nova versão:${NC} $NEW_VERSION"
echo ""

# Confirmar
echo -e "${YELLOW}Este script irá:${NC}"
echo "  1. Atualizar versão para $NEW_VERSION"
echo "  2. Criar commit 'chore: release v$NEW_VERSION'"
echo "  3. Criar tag 'v$NEW_VERSION'"
echo "  4. Push para origin"
echo "  5. Push da tag (dispara publicação no NPM)"
echo ""
read -p "$(echo -e ${YELLOW}Continuar? (y/N): ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Cancelado.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Atualizando versão...${NC}"
pnpm run version:update $NEW_VERSION

echo -e "${BLUE}Criando commit...${NC}"
git add -A
git commit -m "chore: release v$NEW_VERSION"

echo -e "${BLUE}Criando tag...${NC}"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo -e "${BLUE}Pushando para origin...${NC}"
git push origin main

echo -e "${BLUE}Pushando tag...${NC}"
git push origin "v$NEW_VERSION"

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  Release v$NEW_VERSION criado!        ${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${BLUE}A publicação no NPM começará em:${NC}"
echo -e "${BLUE}https://github.com/edsonmartins/archbase-react/actions${NC}"
echo ""
echo -e "${YELLOW}Após a publicação, verifique em:${NC}"
echo -e "${YELLOW}https://www.npmjs.com/package/@archbase/core${NC}"
echo ""
