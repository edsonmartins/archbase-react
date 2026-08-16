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
      // dockview (e seu CSS), Mantine/Tabler e os pacotes @archbase ficam
      // externos: o consumidor ja os tem instalados; embutir duplicaria.
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id === 'react/jsx-runtime' ||
        id.startsWith('dockview') ||
        id.startsWith('@mantine/') ||
        id.startsWith('@tabler/') ||
        id.startsWith('@archbase/') ||
        [
          ...Object.keys(packageJson.peerDependencies || {}),
          ...Object.keys(packageJson.dependencies || {}),
        ].includes(id),
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
    target: 'es2020',
    sourcemap: true,
    // CSS do dockview e importada no fonte e mantida externa; o consumidor a
    // resolve pelo proprio bundler. Nao emitir um style.css vazio a parte.
    cssCodeSplit: false,
  },
});
