#!/bin/bash

# Script para build manual de todos os pacotes em ordem específica
# Evita problemas com dependências circulares no turbo

echo "🚀 Iniciando build manual de todos os pacotes..."

# Ordem de build baseada nas dependências
BUILD_ORDER=(
  "core"
  "data"
  "security"
  "layout"
  "components"
  "advanced"
  "template"
  "admin"
  "tools"
)

FAILED_PACKAGES=()

for package in "${BUILD_ORDER[@]}"; do
  echo ""
  echo "📦 Building package: @archbase/$package"
  
  cd "packages/$package"
  pnpm install;
  if pnpm build; then
    echo "✅ $package build successful"
  else
    echo "❌ $package build failed"
    FAILED_PACKAGES+=("$package")
  fi
  
  cd ../..
done

echo ""
echo "📊 Build Summary:"
echo "================="

if [ ${#FAILED_PACKAGES[@]} -eq 0 ]; then
  echo "🎉 All packages built successfully!"
  exit 0
else
  echo "❌ Failed packages: ${FAILED_PACKAGES[*]}"
  exit 1
fi