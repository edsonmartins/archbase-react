import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: { port: 4300, open: true },
  resolve: {
    // O pacote e consumido pelo FONTE, nao pelo dist: editar um efeito
    // recarrega o demo na hora, sem passo de build no meio. E o que torna este
    // app util para iterar, e nao so para olhar.
    alias: {
      '@archbase/effects': resolve(__dirname, '../../packages/effects/src/index.ts'),
    },
    // O pacote esta fora desta arvore; sem dedupe, React e Mantine viriam em
    // duas copias e o contexto do provider nao seria compartilhado.
    dedupe: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
  },
});
