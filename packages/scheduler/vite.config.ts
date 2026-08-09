import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ArchbaseScheduler',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Mantine e React vêm do consumidor; as demais são dependências do pacote e vão embutidas
      // para que quem instala não precise declarar nada além do Mantine.
      external: ['react', 'react-dom', 'react/jsx-runtime', '@mantine/core', '@mantine/hooks'],
    },
  },
  plugins: [react(), dts({ insertTypesEntry: true })],
});
