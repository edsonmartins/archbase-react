import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseEdit } from '@archbase/components';
import { ArchbaseGlobalProvider, useArchbaseTranslation } from '@archbase/core';

const translationName = 'storybook';
const translationResource = {
  'pt-BR': {
    storybook: {
      welcome: 'Bem-vindo ao Storybook Archbase',
      provider: 'Provider carregado',
      editLabel: 'Nome (PT-BR)'
    }
  }
};

const TranslationDemo = () => {
  const { t } = useArchbaseTranslation('storybook');
  return (
    <p>
      {t('storybook:welcome', { defaultValue: 'Welcome to Archbase Storybook' })} —{' '}
      {t('storybook:provider')}
    </p>
  );
};

const ProviderThemeDemo = () => (
  <ArchbaseGlobalProvider
    colorScheme="light"
    translationName={translationName}
    translationResource={translationResource}
  >
    <TranslationDemo />
    <ArchbaseEdit label="Nome" placeholder="Digite aqui" />
  </ArchbaseGlobalProvider>
);

const meta: Meta = {
  title: 'Foundations/Provider',
  parameters: {
    docs: {
      description: {
        component: `
# Foundations

O *Foundations* é onde documentamos os providers-chave (\`ArchbaseGlobalProvider\`, \`ArchbaseSecurityProvider\`, \`ArchbaseSSRProvider\`), as cores \`Mantine\` e o \`useArchbaseTranslation\`.

\`\`\`tsx
const translationResource = {
  'pt-BR': {
    storybook: {
      welcome: 'Bem-vindo ao Storybook Archbase'
    }
  }
};
\`\`\`
        `
      }
    }
  }
};

export default meta;

export const ProviderTheme: StoryObj = {
  name: 'Provider + Theme',
  render: () => <ProviderThemeDemo />
};
