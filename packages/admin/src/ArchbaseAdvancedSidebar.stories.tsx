import type { Meta, StoryObj } from '@storybook/react';
import { useMantineTheme } from '@mantine/core';
import React from 'react';
import { ArchbaseAdvancedSidebar } from './ArchbaseAdvancedSidebar';
import { navigationDataSampleWithGroup } from './navigationDataWithGroup';
import { MemoryRouter } from 'react-router-dom';

const ArchbaseAdvancedSidebarExample = () => {
  const theme = useMantineTheme();

  return (
    <MemoryRouter>
      <div style={{ width: '100%', height: '800px' }}>
        <ArchbaseAdvancedSidebar
          navigationData={navigationDataSampleWithGroup}
          sidebarHeight="800px"
          sidebarGroupWidth="90px"
          selectedGroupColor="#132441"
          groupColor="white"
          backgroundGroupColor="#132441"
          groupLabelDarkColor="white"
          groupLabelLightColor="white"
          theme={theme}
        />
      </div>
    </MemoryRouter>
  );
};

const ArchbaseAdvancedSidebarWithoutLabelExample = () => {
  const theme = useMantineTheme();

  return (
    <MemoryRouter>
      <div style={{ width: '100%', height: '800px' }}>
        <ArchbaseAdvancedSidebar
          navigationData={navigationDataSampleWithGroup}
          sidebarHeight="800px"
          sidebarGroupWidth="60px"
          selectedGroupColor="#132441"
          groupColor="white"
          backgroundGroupColor="#132441"
          groupLabelDarkColor="white"
          groupLabelLightColor="white"
          showGroupLabels={false}
          theme={theme}
        />
      </div>
    </MemoryRouter>
  );
};

const meta: Meta<typeof ArchbaseAdvancedSidebar> = {
  title: 'Admin/Advanced Sidebar',
  component: ArchbaseAdvancedSidebar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseAdvancedSidebar é um componente de menu lateral avançado com suporte a grupos.

## Características
- Agrupamento de itens de menu
- Ícones customizáveis por grupo
- Suporte a tema claro/escuro
- Labels opcionais nos grupos
- Cores customizáveis
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseAdvancedSidebar>;

export const ComLabelEFundoCustomizado: Story = {
  name: 'Com label e fundo customizado',
  render: () => <ArchbaseAdvancedSidebarExample />,
};

export const SemLabelEFundoCustomizado: Story = {
  name: 'Sem label e fundo customizado',
  render: () => <ArchbaseAdvancedSidebarWithoutLabelExample />,
};
