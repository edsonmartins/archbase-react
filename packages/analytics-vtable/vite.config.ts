import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts') },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // VTable e dependencia, mas fica externa para nao duplicar no bundle do
        // consumidor — o npm a instala junto com o pacote.
        '@visactor/vtable',
        ...Object.keys(packageJson.peerDependencies || {}),
        ...Object.keys(packageJson.dependencies || {}).filter((dep) => dep.startsWith('@archbase/')),
      ],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
    target: 'es2020',
    sourcemap: true,
  },
});
