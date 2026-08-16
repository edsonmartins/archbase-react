import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const src = (p: string) => resolve(__dirname, p)

// Alias para o *source* dos pacotes analytics: editar a lib recarrega na hora,
// sem passo de build. Ordem importa — a entrada `/charts` vem antes da base,
// e a base usa regex exata para não capturar o subpath.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@archbase/analytics-core',
        replacement: src('../../packages/analytics-core/src/index.ts'),
      },
      {
        find: /^@archbase\/analytics-vtable$/,
        replacement: src('../../packages/analytics-vtable/src/index.ts'),
      },
      {
        find: /^@archbase\/analytics-dockview$/,
        replacement: src('../../packages/analytics-dockview/src/index.ts'),
      },
      {
        find: '@archbase/analytics-mantine/charts',
        replacement: src('../../packages/analytics-mantine/src/charts.ts'),
      },
      {
        find: /^@archbase\/analytics-mantine$/,
        replacement: src('../../packages/analytics-mantine/src/index.ts'),
      },
    ],
    dedupe: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
  },
  server: { port: 3010, open: true },
})
