import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseFileAttachment', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-file-attachment' },
  { name: 'ArchbaseImageEdit', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-image-edit' }
];

const UploadLinksDemo = () => (
  <div>
    <p>
      Referencie <code>ArchbaseFileAttachment</code> e <code>ArchbaseImageEdit</code> (quando
      aplicável) através dos <code>canonicalUrl</code> do catálogo ao documentar upload/anexo.
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
      Inclua observações sobre <code>accept</code>, <code>maxFiles</code> e preview. Use o catalog
      link nos recipes e em <code>llms.txt</code>.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/Upload Recipes',
  parameters: {
    docs: {
      description: {
        component: '# Upload Recipes\n\nReceitas e links canônicos para upload de arquivos.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <UploadLinksDemo />
};
