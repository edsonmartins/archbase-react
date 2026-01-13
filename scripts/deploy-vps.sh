#!/bin/bash
# Script manual de deploy da documentação no VPS
# Uso: ./scripts/deploy-vps.sh [ ambiente ]
#   ambiente: local (default) ou vps

set -e

AMBIENTE="${1:-local}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/docs-site"
DEPLOY_DIR="/srv/archbase-react-docs"
INFRA_DIR="/opt/archbase-infrastructure"

echo "=== Deploy da Documentação Archbase React ==="
echo "Ambiente: $AMBIENTE"
echo "Projeto: $PROJECT_ROOT"

# Build dos pacotes
echo ""
echo "1. Build dos pacotes..."
cd "$PROJECT_ROOT"
pnpm run build:dev

# Build da documentação
echo ""
echo "2. Build da documentação..."
cd "$DOCS_DIR"
export NODE_OPTIONS=--max_old_space_size=8192
pnpm run build

# Deploy
if [ "$AMBIENTE" = "vps" ]; then
  echo ""
  echo "3. Deploy no VPS..."

  # Criar diretório de deploy
  sudo mkdir -p "$DEPLOY_DIR"

  # Backup da versão anterior
  if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
    echo "Criando backup..."
    sudo mkdir -p "$DEPLOY_DIR.backup"
    BACKUP_DIR="$DEPLOY_DIR.backup/$(date +%Y%m%d_%H%M%S)"
    sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
    echo "Backup criado em: $BACKUP_DIR"
  fi

  # Copiar arquivos buildados
  echo "Copiando arquivos..."
  sudo rm -rf "$DEPLOY_DIR"/*
  sudo cp -r "$DOCS_DIR/out/"* "$DEPLOY_DIR/"

  # Recrear container
  echo "Recriando container Docker..."
  cd "$INFRA_DIR" || echo "Aviso: $INFRA_DIR não encontrado, pulando docker-compose"
  if [ -f "$INFRA_DIR/docker-compose.yml" ]; then
    docker-compose up -d react-docs
    echo "Container atualizado!"
  fi

  echo ""
  echo "Deploy concluído com sucesso!"
  echo "Acesse: https://react.archbase.dev"
else
  echo ""
  echo "Build local concluído!"
  echo "Para testar localmente, use: cd docs-site && pnpm start"
  echo "Para deploy no VPS, execute: $0 vps"
fi
