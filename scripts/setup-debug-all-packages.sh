#!/bin/bash

# setup-debug-simple.sh
# Script simplificado para configurar debugging

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Configurações
ARCHBASE_PATH="/Users/edsonmartins/tmp/archbase-react-v3/packages"

print_message $BLUE "🚀 Configurando debugging para pacotes Archbase..."
print_message $YELLOW "Diretório base: ${ARCHBASE_PATH}"

# Verificar se o diretório existe
if [ ! -d "${ARCHBASE_PATH}" ]; then
  print_message $RED "❌ Diretório não encontrado: ${ARCHBASE_PATH}"
  exit 1
fi

# Listar e processar cada pacote
for dir in "${ARCHBASE_PATH}"/*; do
  if [ -d "$dir" ]; then
    package_name=$(basename "$dir")
    
    print_message $BLUE "📦 Processando: ${package_name}"
    
    # Verificar se tem package.json
    if [ -f "$dir/package.json" ]; then
      # Criar vite.config.debug.js
      cat > "$dir/vite.config.debug.js" << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: `Archbase${pkg.name.split('/')[1].charAt(0).toUpperCase() + pkg.name.split('/')[1].slice(1)}`,
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: (id) => {
        const peerDeps = Object.keys(pkg.peerDependencies || {});
        for (const dep of peerDeps) {
          if (id === dep || id.startsWith(dep + '/')) {
            return true;
          }
        }
        
        const deps = Object.keys(pkg.dependencies || {});
        for (const dep of deps) {
          if (id === dep || id.startsWith(dep + '/')) {
            return true;
          }
        }
        
        if (id === 'lodash' || id.startsWith('lodash/')) {
          return true;
        }
        
        return false;
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    minify: false,
    target: 'esnext'
  },
  esbuild: {
    keepNames: true,
    target: 'esnext',
    treeShaking: false
  },
  mode: 'development'
});
EOF
      
      # Criar build-debug.sh
      cat > "$dir/build-debug.sh" << 'EOF'
#!/bin/bash
echo "🔧 Fazendo build debug..."

if [ -f "vite.config.js" ]; then
  cp vite.config.js vite.config.js.backup
fi

cp vite.config.debug.js vite.config.js
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build debug concluído!"
else
  echo "❌ Build debug falhou!"
fi

if [ -f "vite.config.js.backup" ]; then
  cp vite.config.js.backup vite.config.js
  rm vite.config.js.backup
fi
EOF
      chmod +x "$dir/build-debug.sh"
      
      # Criar publish-debug.sh
      cat > "$dir/publish-debug.sh" << 'EOF'
#!/bin/bash
VERDACCIO_URL="http://localhost:4873"
PACKAGE_NAME=$(node -p "require('./package.json').name")
CURRENT_VERSION=$(node -p "require('./package.json').version")
DEBUG_VERSION="${CURRENT_VERSION}-debug.$(date +%Y%m%d%H%M%S)"

echo "🚀 Publicando ${PACKAGE_NAME}@${DEBUG_VERSION}..."

cp package.json package.json.backup

node -e "
const pkg = require('./package.json');
pkg.version = '${DEBUG_VERSION}';
pkg.files = ['dist', 'src'];
pkg.publishConfig = { registry: '${VERDACCIO_URL}' };
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

./build-debug.sh
npm publish --registry="${VERDACCIO_URL}"

cp package.json.backup package.json
rm package.json.backup
EOF
      chmod +x "$dir/publish-debug.sh"
      
      print_message $GREEN "  ✅ Arquivos debug criados"
    else
      print_message $YELLOW "  ⚠️  Sem package.json"
    fi
  fi
done

print_message $GREEN "🎉 Configuração concluída!"
print_message $YELLOW "💡 Para usar:"
print_message $YELLOW "  cd ${ARCHBASE_PATH}/[pacote]"
print_message $YELLOW "  ./build-debug.sh"
print_message $YELLOW "  ./publish-debug.sh"