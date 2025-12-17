import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseEdit', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-edit' },
  { name: 'ArchbaseActionButtons', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-action-buttons' },
  { name: 'ArchbaseMaskEdit', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-mask-edit' }
];

const FormLinksDemo = () => (
  <div>
    <p>
      Use <code>ArchbaseEdit</code>, <code>ArchbaseMaskEdit</code> e{' '}
      <code>ArchbaseActionButtons</code> vinculados ao <code>canonicalUrl</code> do catálogo para
      montar um formulário completo com validação e loading.
    </p>
    <ul>
      {catalogComponents.map((component) => (
        <li key={component.name}>
          <strong>{component.name}</strong>:{' '}
          <a href={component.canonicalUrl}>{component.canonicalUrl}</a>
        </li>
      ))}
    </ul>
    <p>
      Essa página serve de referência rápida para IA/teams recriarem o formulário com validação,
      loading e erro centralizado.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/Form Recipes',
  parameters: {
    docs: {
      description: {
        component: '# Form Recipes\n\nReceitas e links canônicos para componentes de formulário.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <FormLinksDemo />
};
