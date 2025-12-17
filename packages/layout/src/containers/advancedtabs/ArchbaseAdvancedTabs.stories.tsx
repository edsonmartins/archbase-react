import type { Meta, StoryObj } from '@storybook/react';
import { Button, Group, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React, { useState } from 'react';
import { ArchbaseAdvancedTabItem, ArchbaseAdvancedTabs } from './ArchbaseAdvancedTabs';

const ArchbaseAdvancedTabsExample = () => {
  const [tabs, setTabs] = useState<ArchbaseAdvancedTabItem[]>([
    { key: 0, favicon: 'https://www.google.com/favicon.ico', title: 'Google' },
    {
      key: 1,
      favicon: 'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico',
      title: 'Facebook',
    },
    {
      key: 2,
      favicon: 'https://github.githubassets.com/favicons/favicon.svg',
      title: 'GitHub',
    },
  ]);
  const [colorScheme] = useLocalStorage<any>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const [key, setID] = useState(2);
  const [current, setCurrent] = useState(0);

  const addTab = (isCurrent: any) => {
    const tab: ArchbaseAdvancedTabItem[] = [
      {
        key: key + 1,
        title: 'Nova Tab',
        favicon: 'https://github.githubassets.com/favicons/favicon.svg',
      },
    ];
    const tmpTabs = tabs.concat(tab);
    !!isCurrent && setCurrent(key + 1);
    setID(key + 1);
    setTabs(tmpTabs);
  };

  const onClose = (tabKey: any) => {
    const tmpTabs = tabs.filter((f) => f.key !== tabKey);
    let idx = -1;
    tabs.forEach((f, index) => f.key === current && (idx = index));
    const isCurrent = tmpTabs.filter((f) => f.key === current).length > 0 ? true : false;
    const tmpCurrent =
      tmpTabs.length > 0
        ? tmpTabs[idx]
          ? tmpTabs[idx].key
          : tmpTabs[tmpTabs.length - 1].key
        : null;
    !isCurrent && setCurrent(tmpCurrent);
    setTabs(tmpTabs);
  };

  return (
    <div className={`root ${colorScheme === 'light' ? '' : ' dark-theme'}`}>
      <ArchbaseAdvancedTabs
        currentTabs={tabs}
        dark={colorScheme === 'dark'}
        activeTab={current}
        onClick={(tabKey: any) => setCurrent(tabKey)}
        onTabClose={(tabKey: any) => onClose(tabKey)}
        onTabChange={(newTabs: ArchbaseAdvancedTabItem[]) => setTabs(newTabs)}
        buttonCloseOnlyActiveTab={true}
      />
      <Stack h={80} align="center" justify="center">
        <Group>
          <Button onClick={() => addTab(true)}>Adicionar nova Tab</Button>
          <Button onClick={() => addTab(false)}>Adicionar Tab em background</Button>
          <Button onClick={() => onClose(current)}>Remover Tab ativa</Button>
        </Group>
      </Stack>
    </div>
  );
};

const meta: Meta<typeof ArchbaseAdvancedTabs> = {
  title: 'Contêiner/Advanced Tabs',
  component: ArchbaseAdvancedTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseAdvancedTabs é um componente de abas avançado estilo navegador.

## Características
- Abas arrastáveis
- Botão de fechar
- Favicon customizado
- Suporte a tema claro/escuro
- Adição e remoção dinâmica de abas
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseAdvancedTabs>;

export const ExemploSimples: Story = {
  name: 'Exemplo Simples',
  render: () => <ArchbaseAdvancedTabsExample />,
};
