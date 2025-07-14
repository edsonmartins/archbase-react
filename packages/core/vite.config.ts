import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ArchbaseComponents',
      formats: ['es'],
      fileName: 'index'
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
        }
      }
    },
    // Configurações essenciais para debugging
    sourcemap: true,
    minify: false,
    target: 'esnext'
  },
  // Forçar esbuild a não otimizar
  esbuild: {
    keepNames: true,
    target: 'esnext',
    minify: false,
    treeShaking: false
  },
  // Modo desenvolvimento
  mode: 'development',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts'
  }
});