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
