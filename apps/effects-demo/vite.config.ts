import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const src = (p: string) => resolve(__dirname, p);

export default defineConfig({
  plugins: [react()],
  server: { port: 4301, strictPort: true },
  resolve: {
    // Pacotes consumidos pelo FONTE, nao pelo dist: editar um componente
    // recarrega o demo na hora, sem passo de build no meio.
    alias: [
      { find: /^@archbase\/effects$/, replacement: src('../../packages/effects/src/index.ts') },
      { find: /^@archbase\/components$/, replacement: src('../../packages/components/src/index.ts') },
      { find: /^@archbase\/core$/, replacement: src('../../packages/core/src/index.ts') },
      { find: /^@archbase\/data$/, replacement: src('../../packages/data/src/index.ts') },
      { find: /^@archbase\/layout$/, replacement: src('../../packages/layout/src/index.ts') },
    ],
    dedupe: ['react', 'react-dom', '@mantine/core', '@mantine/hooks', '@mantine/dates'],
  },
});
