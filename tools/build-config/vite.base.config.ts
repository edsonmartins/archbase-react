import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export function createViteConfig(options: {
  packageName: string;
  entry?: string;
  external?: string[];
}) {
  const { packageName, entry = 'src/index.ts', external = [] } = options;

  return defineConfig({
    plugins: [react()],
    build: {
      lib: {
        entry: resolve(process.cwd(), entry),
        name: packageName,
        formats: ['es'],
        fileName: 'index'
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', ...external],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          },
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      },
      sourcemap: true,
      minify: 'esbuild',
      target: 'esnext'
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/setup.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'test/',
          '**/*.d.ts',
          '**/*.test.ts',
          '**/*.test.tsx'
        ]
      }
    }
  });
}