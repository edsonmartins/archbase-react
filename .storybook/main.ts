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
    'storybook-addon-mantine',
    'storybook-dark-mode',
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
};

export default config;
