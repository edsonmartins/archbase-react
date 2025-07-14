import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export function createViteConfig(packageName) {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
  
  // Extrai todas as dependências do package.json
  const dependencies = Object.keys(pkg.dependencies || {});
  const peerDependencies = Object.keys(pkg.peerDependencies || {});
  
  // Combina todas as dependências externas
  const externalDependencies = [
    ...new Set([
      ...dependencies,
      ...peerDependencies,
      // Adiciona variações dos pacotes React
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      // Adiciona regex para sub-imports
      /^lodash\/.*/,
      // Adiciona outros pacotes Archbase
      '@archbase/core',
      '@archbase/data',
      '@archbase/components',
      '@archbase/layout',
      '@archbase/admin',
      '@archbase/security',
      '@archbase/template',
      '@archbase/tools',
      '@archbase/advanced',
      '@archbase/ssr'
    ])
  ];

  return defineConfig({
    plugins: [react()],
    build: {
      lib: {
        entry: resolve(process.cwd(), 'src/index.ts'),
        name: packageName,
        formats: ['es'],
        fileName: 'index'
      },
      rollupOptions: {
        external: externalDependencies,
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      },
      sourcemap: true,
      minify: 'esbuild',
      target: 'esnext'
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/setup.ts'
    }
  });
}