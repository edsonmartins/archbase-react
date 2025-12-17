import type { Preview } from '@storybook/react';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Container } from 'inversify';
import { ArchbaseGlobalProvider, initArchbaseI18nEarly } from '@archbase/core';

// Import styles
import '../packages/components/src/arco.css';
import '../packages/components/src/treeviews.scss';
import '../packages/layout/src/spaces.css';
import '../packages/layout/src/advancedtabs.scss';
import '../packages/template/src/template.scss';
import '../packages/admin/src/admin.css';
import '@mantine/core/styles.css';

const translationName = 'storybook';
const translationResource = {
  'pt-BR': {
    storybook: {
      welcome: 'Bem-vindo ao Storybook Archbase',
      provider: 'Provider inicializado'
    }
  }
};

// Create an empty IoC container for Storybook
const storybookContainer = new Container();

initArchbaseI18nEarly(translationName, translationResource);

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: { disable: true },
    docs: {
      iframeHeight: 500
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const scheme = (context.globals.theme || 'light') as 'light' | 'dark';
      return (
        <MantineProvider forceColorScheme={scheme}>
          <ArchbaseGlobalProvider
            colorScheme={scheme}
            containerIOC={storybookContainer}
            translationName={translationName}
            translationResource={translationResource}
            notificationAutoClose={5000}
            withCssVariables
          >
            <Story />
          </ArchbaseGlobalProvider>
        </MantineProvider>
      );
    },
  ],
};

export default preview;
