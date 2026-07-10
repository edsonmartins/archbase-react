import { resolve } from 'path';
import { createViteConfig } from '../../vite.config.shared.mjs';
import pkg from './package.json';

const config = createViteConfig(__dirname, pkg);

config.resolve = {
  ...(config.resolve || {}),
  alias: {
    ...(config.resolve?.alias || {}),
    '@': resolve(__dirname, './src'),
    '@src': resolve(__dirname, './src'),
    '@components': resolve(__dirname, './src/components'),
    '@utils': resolve(__dirname, './src/utils')
  }
};

export default config;
