import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ArchbaseCore',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        // React core
        'react',
        'react-dom',
        'react/jsx-runtime',
        
        // Mantine ecosystem
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/form',
        '@mantine/dates',
        '@mantine/notifications',
        '@mantine/modals',
        '@mantine/spotlight',
        '@tabler/icons-react',
        
        // Lodash
        'lodash',
        /^lodash\/.*/,
        
        // Internationalization
        'i18next',
        'i18next-browser-languagedetector',
        'react-i18next',
        
        // HTTP and data fetching
        'axios',
        '@tanstack/react-query',
        
        // Date utilities
        'dayjs',
        'date-fns',
        
        // Utilities
        'clsx',
        'immer',
        'uuid',
        'crypto-js',
        'file-saver',
        'events',
        'query-string',
        'ramda',
        
        // Validation
        'ajv',
        'validator',
        
        // Forms
        'react-hook-form',
        
        // Dependency Injection
        'inversify',
        
        // Security
        'jwt-decode',
        
        // State management
        'zustand',
        
        // Animation
        'framer-motion',
        
        // Routing
        'react-router-dom',
        
        // Archbase packages
        '@archbase/core',
        '@archbase/data',
        '@archbase/components',
        '@archbase/layout',
        '@archbase/admin',
        '@archbase/security',
        '@archbase/template',
        '@archbase/tools',
        '@archbase/advanced'
      ],
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