#!/bin/bash
echo "🔧 Fazendo build debug..."

if [ -f "vite.config.js" ]; then
  cp vite.config.js vite.config.js.backup
fi

cp vite.config.debug.js vite.config.js
pnpm run build

if [ $? -eq 0 ]; then
  echo "✅ Build debug concluído!"
else
  echo "❌ Build debug falhou!"
fi

if [ -f "vite.config.js.backup" ]; then
  cp vite.config.js.backup vite.config.js
  rm vite.config.js.backup
fi
