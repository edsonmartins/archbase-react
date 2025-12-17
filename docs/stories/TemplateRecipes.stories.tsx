import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseFormTemplate', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-form-template' },
  { name: 'ArchbaseSpaceTemplate', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-space-template' }
];

const TemplateLinksDemo = () => (
  <div>
    <p>
      Ao montar uma página (FormTemplate ou SpaceTemplate) use sempre o <code>canonicalUrl</code>{' '}
      do catálogo para referenciar a story oficial.
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
      Use esses links dentro de MDX/recipes e cite o catálogo sempre que atualizar as props/estados.
      Essa base alimenta <code>llms.txt</code>, <code>DOCS_AUDIT.md</code> e o portal editorial.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Templates/Template Recipes',
  parameters: {
    docs: {
      description: {
        component: '# Template Recipes\n\nReceitas e links canônicos para templates.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <TemplateLinksDemo />
};
