import type { Meta, StoryObj } from '@storybook/react';
import {
  ActionIcon,
  Flex,
  Menu,
  Space,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowsMaximize,
  IconBell,
  IconBrandMessenger,
  IconLogout,
  IconMessageChatbot,
  IconSettings,
  IconSwitchHorizontal,
  IconUserCircle,
} from '@tabler/icons-react';
import React, { Fragment, ReactNode, useMemo, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ArchbaseAdminLayoutFooter } from './ArchbaseAdminLayoutFooter';
import { ArchbaseAdminLayoutHeader } from './ArchbaseAdminLayoutHeader';
import { ArchbaseAdminMainLayout } from './ArchbaseAdminMainLayout';
import { ArchbaseAdminTabContainer } from './ArchbaseAdminTabContainer';
import { navigationDataSampleWithGroup } from './navigationDataWithGroup';
import { ArchbaseTabItem } from './types';
import { useArchbaseAdminStore } from './hooks';

// Fake user para demonstração
const fakeUser = {
  id: '1',
  displayName: 'Archbase Dev',
  email: 'dev@archbase.com.br',
  isAdmin: true,
  photo: null,
};

// Logo placeholder
const archbaseLogo = (
  <Text fw={700} size="lg" c="blue">
    Archbase
  </Text>
);

const ArchbaseAdminMainLayoutExample = () => {
  const adminStore = useArchbaseAdminStore();
  const [collapsed, setCollapsed] = useState(false);
  const theme = useMantineTheme();
  const { toggleColorScheme } = useMantineColorScheme();

  const headerActions = useMemo((): ReactNode => {
    return [
      <Tooltip key="Trocar empresa" withinPortal withArrow label="Trocar empresa">
        <ActionIcon variant="transparent" c={'#868E96'}>
          <IconSwitchHorizontal size="2rem" />
        </ActionIcon>
      </Tooltip>,
      <Tooltip key="Tela cheia" withinPortal withArrow label="Tela cheia">
        <ActionIcon variant="transparent" c={'#868E96'}>
          <IconArrowsMaximize size="2rem" />
        </ActionIcon>
      </Tooltip>,
      <Tooltip key="Notificações" withinPortal withArrow label="Notificações">
        <ActionIcon variant="transparent" c={'#868E96'}>
          <IconBell size="2rem" />
        </ActionIcon>
      </Tooltip>,
      <Tooltip key="Chat" withinPortal withArrow label="Chat">
        <ActionIcon variant="transparent" c={'#868E96'}>
          <IconMessageChatbot size="2rem" />
        </ActionIcon>
      </Tooltip>,
    ];
  }, []);

  return (
    <MemoryRouter>
      <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
        <ArchbaseAdminMainLayout
          navigationData={navigationDataSampleWithGroup}
          navigationRootLink="/"
          sidebarSelectedGroupName="grpPessoas"
          sideBarCollapsedWidth="60px"
          sideBarHeaderContent={
            <Flex h="40px" align="center" justify={'center'} bg={theme.colors.blue[8]} style={{ color: 'white' }}>
              {collapsed ? (
                <IconUserCircle size="2.7rem" color="#63B1FB" stroke={1} />
              ) : (
                <>
                  <Space w={5} />
                  <Text>Olá, Archbase dev!</Text>
                </>
              )}
            </Flex>
          }
          sideBarFooterContent={
            <Flex
              h="40px"
              align="center"
              justify={collapsed ? 'center' : 'end'}
              bg={theme.colors.blue[8]}
              pr={collapsed ? '0px' : '20px'}
              style={{ color: 'white' }}
            >
              {collapsed ? 'v1.0.0' : 'Versão 1.0.0'}
            </Flex>
          }
          sideBarHeaderHeight="40px"
          sideBarFooterHeight="40px"
          onCollapsedSideBar={(collapsed) => {
            setCollapsed(collapsed);
          }}
          onHiddenSidebar={(hidden) => {
            console.log(hidden);
          }}
          header={
            <ArchbaseAdminLayoutHeader
              user={fakeUser}
              showLanguageSelector={true}
              headerActions={headerActions}
              navigationData={navigationDataSampleWithGroup}
              userMenuItems={
                <Fragment>
                  <Menu.Label>Usuário</Menu.Label>
                  <Menu.Item leftSection={<IconUserCircle size={14} />}>Meu perfil</Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={14} />}>Configurações</Menu.Item>
                  <Menu.Divider />
                </Fragment>
              }
              userMenuItemsBeforeToggleColorScheme={
                <Fragment>
                  <Menu.Item leftSection={<IconSwitchHorizontal size={14} />}>Troca empresa</Menu.Item>
                  <Menu.Item leftSection={<IconArrowsMaximize size={14} />}>Tela cheia</Menu.Item>
                  <Menu.Item leftSection={<IconBell size={14} />}>Notificações</Menu.Item>
                  <Menu.Item leftSection={<IconMessageChatbot size={14} />}>Chat</Menu.Item>
                </Fragment>
              }
              userMenuItemsAfterToggleColorScheme={
                <Fragment>
                  <Menu.Label>Conta</Menu.Label>
                  <Menu.Item leftSection={<IconBrandMessenger size={14} />}>Suporte</Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={() => {
                      console.log('Logout');
                    }}
                  >
                    Sair
                  </Menu.Item>
                </Fragment>
              }
              logo={archbaseLogo}
              toggleColorScheme={toggleColorScheme}
            />
          }
        >
          <ArchbaseAdminTabContainer
            onChangeActiveTabId={(activeTabId: string) => adminStore.setActiveTabId(activeTabId)}
            onChangeOpenedTabs={(openedTabs: ArchbaseTabItem[]) => {
              adminStore.setOpenedTabs(openedTabs);
            }}
            openedTabs={adminStore.openedTabs}
            activeTabId={adminStore.activeTabId}
            navigationData={navigationDataSampleWithGroup}
          />
        </ArchbaseAdminMainLayout>
      </div>
    </MemoryRouter>
  );
};

const meta: Meta<typeof ArchbaseAdminMainLayout> = {
  title: 'Admin/Main Layout',
  component: ArchbaseAdminMainLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseAdminMainLayout é o componente principal de layout administrativo.

## Características
- Header customizável com ações
- Sidebar com navegação em grupos
- Suporte a abas dinâmicas
- Menu de usuário completo
- Seletor de idioma
- Toggle de tema claro/escuro
- Footer customizável
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseAdminMainLayout>;

export const ExemploCompleto: Story = {
  name: 'Exemplo Completo',
  render: () => <ArchbaseAdminMainLayoutExample />,
};
