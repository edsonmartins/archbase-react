import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export function createViteConfig(dirname: string, pkg: any) {
  const isDebug = process.env.NODE_ENV === 'development';
  
  const plugins = [react()];
  
  return defineConfig({
    plugins,
    build: {
      lib: {
        entry: resolve(dirname, 'src/index.ts'),
        name: 'Archbase' + pkg.name.split('/')[1].charAt(0).toUpperCase() + pkg.name.split('/')[1].slice(1),
        formats: ['es'],
        fileName: () => 'index.js'
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
            const name = assetInfo.names?.[0] || assetInfo.name;
            if (name && name.endsWith('.css')) {
              return 'index.css';
            }
            return name || 'asset';
          }
        }
      },
      sourcemap: isDebug,
      minify: 'esbuild',
      target: 'esnext'
    },
    esbuild: {
        "target": "esnext"
    },
    mode: isDebug ? 'development' : 'production'
  });
}