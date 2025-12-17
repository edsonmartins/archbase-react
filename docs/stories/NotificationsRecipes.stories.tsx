import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseNotifications', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-notifications' },
  { name: 'ArchbaseAlert', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-alert' }
];

const NotificationsLinksDemo = () => (
  <div>
    <p>
      Aponte para <code>ArchbaseNotifications</code> e <code>ArchbaseAlert</code> via catálogo
      quando documentar toasts e mensagens de status.
    </p>
    <ul>
      {catalogComponents.map((component) => (
        <li key={component.name}>
          <strong>{component.name}</strong>:{' '}
          <a href={component.canonicalUrl}>{component.canonicalUrl}</a>
        </li>
      ))}
    </ul>
    <p>Use esse recipe para mostrar exemplos de toast programático e fallback de alerta.</p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/Notifications Recipes',
  parameters: {
    docs: {
      description: {
        component: '# Notifications Recipes\n\nReceitas e links canônicos para notificações.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <NotificationsLinksDemo />
};
