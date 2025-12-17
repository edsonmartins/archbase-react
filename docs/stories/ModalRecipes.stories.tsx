import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseDialog', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-dialog' },
  { name: 'ArchbaseNotifications', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-notifications' }
];

const ModalLinksDemo = () => (
  <div>
    <p>
      Mostre o fluxo de confirmação com <code>ArchbaseDialog</code> e{' '}
      <code>ArchbaseNotifications</code> usando o <code>canonicalUrl</code> do catálogo para
      referência segura.
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
      Incorpore esses links no recipe "Modal flow com confirmação" e adicione remark sobre
      acessibilidade (<code>aria-modal</code>, foco, ESC).
    </p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/Modal Recipes',
  parameters: {
    docs: {
      description: {
        component: '# Modal Recipes\n\nReceitas e links canônicos para modais e diálogos.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <ModalLinksDemo />
};
