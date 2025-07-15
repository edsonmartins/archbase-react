#!/usr/bin/env node

/**
 * Script de configuração de build para alternar entre modo debug e produção
 * Uso: node scripts/build-config.js [debug|production]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.argv[2] || 'production';
const isDebug = mode === 'debug';

console.log(`🔧 Configurando build para modo: ${mode}`);

// Configuração base compartilhada
const baseConfig = {
  sourcemap: isDebug,
  minify: isDebug ? false : 'esbuild',
  target: 'esnext',
  mode: isDebug ? 'development' : 'production'
};

// Configuração do esbuild
const esbuildConfig = isDebug ? {
  keepNames: true,
  target: 'esnext',
  minify: false,
  treeShaking: false
} : {
  target: 'esnext'
};

// Template da configuração do Vite
const createViteConfig = (packageName, entry = 'src/index.ts') => `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      skipDiagnostics: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, '${entry}'),
      name: 'Archbase' + pkg.name.split('/')[1].charAt(0).toUpperCase() + pkg.name.split('/')[1].slice(1),
      formats: ['es'],
      fileName: (format) => 'index.js'
    },
    rollupOptions: {
      external: (id) => {
        // Sempre externos: peerDependencies
        const peerDeps = Object.keys(pkg.peerDependencies || {});
        for (const dep of peerDeps) {
          if (id === dep || id.startsWith(dep + '/')) {
            return true;
          }
        }
        
        // Todas as dependências devem ser externas
        const deps = Object.keys(pkg.dependencies || {});
        for (const dep of deps) {
          if (id === dep || id.startsWith(dep + '/')) {
            return true;
          }
        }
        
        // Lodash paths
        if (id === 'lodash' || id.startsWith('lodash/')) {
          return true;
        }
        
        return false;
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'index.css';
          }
          return assetInfo.name;
        }
      }
    },
    sourcemap: ${baseConfig.sourcemap},
    minify: ${typeof baseConfig.minify === 'string' ? `'${baseConfig.minify}'` : baseConfig.minify},
    target: '${baseConfig.target}'
  },
  esbuild: ${JSON.stringify(esbuildConfig, null, 4).replace(/\n/g, '\n  ')},
  mode: '${baseConfig.mode}',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts'
  }
});
`;

// Lista de pacotes para atualizar
const packages = [
  'core',
  'components', 
  'data',
  'admin',
  'advanced',
  'layout',
  'security',
  'template',
  'tools',
  'ssr'
];

// Atualizar configuração de cada pacote
packages.forEach(packageName => {
  const packagePath = path.join(__dirname, '..', 'packages', packageName);
  const configPath = path.join(packagePath, 'vite.config.ts');
  
  if (fs.existsSync(packagePath)) {
    // Fazer backup se ainda não existir
    const backupPath = path.join(packagePath, 'vite.config.ts.backup');
    if (!fs.existsSync(backupPath) && fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, backupPath);
    }
    
    // Escrever nova configuração
    const config = createViteConfig(packageName);
    fs.writeFileSync(configPath, config);
    console.log(`✅ ${packageName}: configuração atualizada`);
  }
});

// Criar script de build global
const buildScript = `#!/bin/bash
# Script de build para modo ${mode}

echo "🚀 Iniciando build em modo ${mode}..."

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
for package in "\${packages[@]}"; do
  build_package $package
done

echo "🎉 Build completo em modo ${mode}!"
`;

// Salvar script de build
const buildScriptPath = path.join(__dirname, `build-all-${mode}.sh`);
fs.writeFileSync(buildScriptPath, buildScript);
fs.chmodSync(buildScriptPath, '755');

console.log(`\n✅ Configuração completa para modo ${mode}!`);
console.log(`📄 Script de build criado: scripts/build-all-${mode}.sh`);
console.log(`\n🚀 Para fazer build de todos os pacotes:`);
console.log(`   ./scripts/build-all-${mode}.sh`);