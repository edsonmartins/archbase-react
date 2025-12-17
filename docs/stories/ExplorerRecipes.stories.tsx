import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseAsyncSelect', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-async-select' },
  { name: 'ArchbaseLookupSelect', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-lookup-select' },
  { name: 'ArchbaseTreeSelect', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-tree-select' }
];

const RemoteSelectLinksDemo = () => (
  <div>
    <p>
      Use <code>ArchbaseAsyncSelect</code>, <code>ArchbaseLookupSelect</code>,{' '}
      <code>ArchbaseTreeSelect</code> (quando aplicável) com <code>canonicalUrl</code> do catálogo
      para mostrar busca remota.
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
      Documente debounce/search e binding com dataSource usando o dataset do Storybook. Também
      destaque <code>onChangeValue</code>.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/Remote Select',
  parameters: {
    docs: {
      description: {
        component: '# Remote Select Recipes\n\nReceitas e links canônicos para selects remotos.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <RemoteSelectLinksDemo />
};
