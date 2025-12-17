import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseEdit', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-edit' },
  { name: 'ArchbaseDataGrid', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-data-grid' },
  { name: 'ArchbaseFormTemplate', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-form-template' }
];

const CatalogLinksDemo = () => (
  <ul>
    {catalogComponents.map((component) => (
      <li key={component.name}>
        <strong>{component.name}</strong>:{' '}
        <a href={component.canonicalUrl}>{component.canonicalUrl}</a>
      </li>
    ))}
  </ul>
);

const meta: Meta = {
  title: 'Foundations/Catalog Links',
  parameters: {
    docs: {
      description: {
        component: `
# Catalog Links

O \`component-catalog.json\` gera \`canonicalUrl\` para cada componente. Use esse link nos recipes, MDX e \`llms.txt\` para apontar ao Storybook oficial.

\`\`\`json
{
  "name": "ArchbaseDataGrid",
  "canonicalUrl": "https://docs.archbase.com/storybook/archbase-data-grid"
}
\`\`\`
        `
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <CatalogLinksDemo />
};
