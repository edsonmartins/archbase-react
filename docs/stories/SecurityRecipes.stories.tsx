import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseSecurityProvider', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-security-provider' },
  { name: 'ArchbaseSecurityView', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-security-view' },
  { name: 'ArchbaseApiTokenView', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-api-token-view' },
  { name: 'UserModal', canonicalUrl: 'https://docs.archbase.com/storybook/user-modal' },
  { name: 'GroupModal', canonicalUrl: 'https://docs.archbase.com/storybook/group-modal' },
  { name: 'ApiTokenModal', canonicalUrl: 'https://docs.archbase.com/storybook/api-token-modal' },
  { name: 'PermissionsSelectorModal', canonicalUrl: 'https://docs.archbase.com/storybook/permissions-selector-modal' }
];

const SecurityLinksDemo = () => (
  <div>
    <h2>Passo a passo</h2>
    <ol>
      <li>
        <strong>Provider</strong>: envolva a app em <code>ArchbaseSecurityProvider</code> para expor{' '}
        <code>useArchbaseSecurity</code> e <code>useArchbasePermissionCheck</code>.
      </li>
      <li>
        <strong>SecurityView</strong>: conecte usuários, grupos, perfis, recursos e tokens usando{' '}
        <code>ArchbaseDataGrid</code> + <code>ArchbaseDualListSelector</code>.
      </li>
      <li>
        <strong>Modais</strong>: abra <code>UserModal</code>, <code>GroupModal</code>,{' '}
        <code>ApiTokenModal</code> e <code>PermissionsSelectorModal</code> para gerenciar entidades
        e permissões.
      </li>
      <li>
        <strong>Ações seguras</strong>: use <code>ArchbaseSecureActionButton</code>/
        <code>ArchbaseSecureFormField</code> com <code>requiredPermissions</code> para manter o
        controle de acesso.
      </li>
    </ol>

    <h2>Links canônicos</h2>
    <ul>
      {catalogComponents.map((component) => (
        <li key={component.name}>
          <strong>{component.name}</strong>:{' '}
          <a href={component.canonicalUrl}>{component.canonicalUrl}</a>
        </li>
      ))}
    </ul>

    <p>
      Use esses links para documentar os recipes de segurança e referenciar as docs do Storybook nos{' '}
      <code>llms.txt</code> e <code>DOCS_AUDIT.md</code>.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Security/Security Recipes',
  parameters: {
    docs: {
      description: {
        component: `
# Security Recipes

Antes de montar um fluxo de segurança (SecurityView + ApiTokenView), consulte o \`component-catalog.json\` para obter o \`canonicalUrl\`.
        `
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <SecurityLinksDemo />
};
