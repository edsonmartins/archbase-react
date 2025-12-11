import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseSecurityView } from './ArchbaseSecurityView';

const meta: Meta<typeof ArchbaseSecurityView> = {
  title: 'Security/ArchbaseSecurityView',
  component: ArchbaseSecurityView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Visão completa de segurança. O story exibe a UI e explica que a integração real depende de serviços configurados.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseSecurityView>;

export const ReadOnlyPreview: Story = {
  args: {
    createEntitiesWithId: false
  },
  render: (args) => (
    <div style={{ minHeight: 450, padding: 16, background: '#fff', borderRadius: 8 }}>
      <p>
        Este story mostra o layout do <strong>ArchbaseSecurityView</strong>. A funcionalidade completa exige serviços
        remotos configurados via IOC. Use o `canonicalUrl` do catálogo para encontrar a story definitiva e a page
        do docs.
      </p>
      <ArchbaseSecurityView {...args} />
    </div>
  )
};
