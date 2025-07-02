import "reflect-metadata";
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
  staticDirs: ['./assets'],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      },
    },
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      }
    }
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
        '@emaileditor': path.resolve(__dirname, '../src/components/emaileditor'),
        'components/hooks': path.resolve(__dirname, '../src/components/hooks'),
        'components/datagrid': path.resolve(__dirname, '../src/components/datagrid'),
        'components/querybuilder': path.resolve(__dirname, '../src/components/querybuilder'),
        'components/core': path.resolve(__dirname, '../src/components/core'),
        'components/notification': path.resolve(__dirname, '../src/components/notification'),
        'components/datasource': path.resolve(__dirname, '../src/components/datasource'),
        'components/datatable': path.resolve(__dirname, '../src/components/datatable'),
      };
    }
    return config;
  },
  docs: {
    autodocs: true,
  },
  core: {
    disableTelemetry: true
  }  
};



export default config;


