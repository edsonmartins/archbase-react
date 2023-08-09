import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path'
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.stories.mdx',
    '../src/**/*.story.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.story.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-actions',
    'storybook-addon-mantine',
    'storybook-dark-mode',
    'storybook-react-i18next',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true
      }
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@hooks': path.resolve(__dirname, '../src/components/hooks'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@demo': path.resolve(__dirname, '../src/demo'),
      };
    }
    return config;
  },
  docs: {
    autodocs: true,
  },
  core: {
    disableTelemetry: true,
  },  
  refs: {
    'mantine': {
      title: 'Mantine',
      url: 'https://spigelli.github.io/mantine-storybook/',
      expanded: false, // Optional, true by default
    },
  },
};

export default config;
