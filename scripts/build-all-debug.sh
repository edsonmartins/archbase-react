#!/bin/bash
# Script de build para modo debug

echo "🚀 Iniciando build em modo debug..."

# Array de pacotes na ordem correta de dependência
packages=(
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

# Função para fazer build de um pacote
build_package() {
  local package=$1
  echo "📦 Building @archbase/$package..."
  
  cd packages/$package
  
  # Limpar dist anterior
  rm -rf dist
  
  # Build
  npm run build
  
  if [ $? -eq 0 ]; then
    echo "✅ $package: build concluído"
  else
    echo "❌ $package: build falhou"
    exit 1
  fi
  
  cd ../..
}

# Build de todos os pacotes
for package in "${packages[@]}"; do
  build_package $package
done

echo "🎉 Build completo em modo debug!"
