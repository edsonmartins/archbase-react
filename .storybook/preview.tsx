// Import styles of packages
import '../packages/components/src/arco.css';
import '../packages/components/src/treeviews.scss';
import '../packages/layout/src/spaces.css';
import '../packages/layout/src/advancedtabs.scss';
import '../packages/template/src/template.scss';
import '../packages/admin/src/admin.css';
import '@mantine/core/styles.css';

import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ArchbaseGlobalProvider, initArchbaseI18nEarly } from '@archbase/core';

const translationName = 'storybook';
const translationResource = {
  'pt-BR': {
    storybook: {
      welcome: 'Bem-vindo ao Storybook Archbase',
      provider: 'Provider inicializado'
    }
  }
};

initArchbaseI18nEarly(translationName, translationResource);

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
  options: {
    showPanel: true,
    storySort: (a: any, b: any) => a.title.localeCompare(b.title, undefined, { numeric: true }),
  },
  backgrounds: { disable: true },
  docs: {
    inlineStories: true,
    iframeHeight: 500
  }
};

export const globalTypes = {
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
};

export const decorators = [
  (Story: any, context: any) => {
    const scheme = (context.globals.theme || 'light') as 'light' | 'dark';
    return (
      <MantineProvider forceColorScheme={scheme}>
        <ColorSchemeScript />
        <ArchbaseGlobalProvider
          colorScheme={scheme}
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
];
