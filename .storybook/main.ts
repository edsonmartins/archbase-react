import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packages = [
  'core',
  'data',
  'components',
  'layout',
  'security',
  'security-ui',
  'advanced',
  'template',
  'admin',
  'tools',
  'ssr'
];

const aliases = packages.reduce<Record<string, string>>((map, pkg) => {
  map[`@archbase/${pkg}`] = path.resolve(__dirname, `../packages/${pkg}/src`);
  return map;
}, {});

const config: StorybookConfig = {
  stories: [
    '../docs/stories/**/*.stories.tsx',
    '../packages/**/src/**/*.stories.tsx'
  ],
  staticDirs: ['../docs/static'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: true
  },
  core: {
    disableTelemetry: true
  },
  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...aliases
    };
    return config;
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  }
};

export default config;
