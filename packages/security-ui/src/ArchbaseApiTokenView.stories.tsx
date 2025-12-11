import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseApiTokenView } from './ArchbaseApiTokenView';

const meta: Meta<typeof ArchbaseApiTokenView> = {
  title: 'Security/ArchbaseApiTokenView',
  component: ArchbaseApiTokenView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'View especializada em tokens de API. O story mostra a estrutura básica; conecte o backend para dados reais.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseApiTokenView>;

export const StaticPreview: Story = {
  render: () => (
    <div style={{ margin: 16, background: '#fafafa', padding: 24, borderRadius: 8 }}>
      <p>
        API tokens precisam de serviço e ambiente de segurança. Use a story oficial do catálogo (link em
        `component-catalog.json`) para explorar fluxos completos.
      </p>
      <ArchbaseApiTokenView />
    </div>
  )
};
