import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseDataGrid', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-data-grid' },
  { name: 'ArchbaseDataGridToolbar', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-data-grid-toolbar' },
  { name: 'ArchbaseDetailPanel', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-detail-panel' }
];

const DataGridLinksDemo = () => (
  <div>
    <p>
      Referencie <code>ArchbaseDataGrid</code>, <code>ArchbaseDataGridToolbar</code> e{' '}
      <code>ArchbaseDetailPanel</code> usando os <code>canonicalUrl</code> para demonstrar
      loading/empty/actions.
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
      Use essas referências em MDX/receitas para documentar ações, exportação e painéis detalhados
      que o Storybook já mostra.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/DataGrid Recipes',
  parameters: {
    docs: {
      description: {
        component: '# DataGrid Recipes\n\nReceitas e links canônicos para componentes de DataGrid.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <DataGridLinksDemo />
};
