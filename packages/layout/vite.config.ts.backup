import { defineConfig } from 'vite';
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
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ArchbaseLayout',
      formats: ['es'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
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
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'index.css';
          }
          return assetInfo.name || '';
        },
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts'
  }
});
