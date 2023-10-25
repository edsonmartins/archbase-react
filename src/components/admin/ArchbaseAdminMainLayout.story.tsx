import React, { Fragment, ReactNode, useMemo } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ActionIcon, Menu, Tooltip } from '@mantine/core'
import {
  IconArrowsMaximize,
  IconBell,
  IconMessageChatbot,
  IconSwitchHorizontal,
  IconUserCircle,
} from '@tabler/icons-react'
import { IconSettings } from '@tabler/icons-react'
import { IconLogout } from '@tabler/icons-react'
import { IconBrandMessenger } from '@tabler/icons-react'
import { useArchbaseAdminStore } from '@components/hooks'

import { ArchbaseAdminMainLayout } from './ArchbaseAdminMainLayout'
import { ArchbaseAdminLayoutFooter } from './ArchbaseAdminLayoutFooter'
import { ArchbaseAdminLayoutHeader } from './ArchbaseAdminLayoutHeader'
import { ArchbaseUser } from '../auth/ArchbaseUser'
import { ArchbaseAdminTabContainer } from './ArchbaseAdminTabContainer'
import { navigationDataSample } from './navigationData'
import { archbaseLogo3 } from '../core'
import { ArchbaseTabItem } from './types'
import { navigationDataSampleWithGroup } from './navigationDataWithGroup'

const fakeUser: ArchbaseUser = {
  id: '1',
  displayName: 'Edson Martins',
  email: 'edsonmartins2005@gmail.com',
  isAdmin: true,
  photo:
    'data:image/jpeg;base64,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',
}

const ArchbaseAdminMainLayoutExample = () => {
  const adminStore = useArchbaseAdminStore()

  const headerActions = useMemo((): ReactNode => {
    return [
      <Tooltip withinPortal withArrow label="Trocar empresa">
        <ActionIcon variant="transparent">
          <IconSwitchHorizontal size="2rem" />
        </ActionIcon>
      </Tooltip>,
      <Tooltip withinPortal withArrow label="Tela cheia">
        <ActionIcon variant="transparent">
          <IconArrowsMaximize size="2rem" />
        </ActionIcon>
      </Tooltip>,
      <Tooltip withinPortal withArrow label="Notificações">
        <ActionIcon variant="transparent">
          <IconBell size="2rem" />
        </ActionIcon>
      </Tooltip>,
      <Tooltip withinPortal withArrow label="Chat">
        <ActionIcon variant="transparent">
          <IconMessageChatbot size="2rem" />
        </ActionIcon>
      </Tooltip>,
    ]
  }, [])

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
      <ArchbaseAdminMainLayout
        navigationData={navigationDataSampleWithGroup}
        navigationRootLink="/"
        footer={<ArchbaseAdminLayoutFooter />}
        header={
          <ArchbaseAdminLayoutHeader
            user={fakeUser}
            headerActions={headerActions}
            navigationData={navigationDataSampleWithGroup}
            userMenuItems={
              <Fragment>
                <Menu.Label>Usuário</Menu.Label>
                <Menu.Item icon={<IconUserCircle size={14} />}>Meu perfil</Menu.Item>
                <Menu.Item icon={<IconSettings size={14} />}>Configurações</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Conta</Menu.Label>
                <Menu.Item icon={<IconBrandMessenger size={14} />}>Suporte</Menu.Item>
                <Menu.Item
                  color="red"
                  icon={<IconLogout size={14} />}
                  onClick={() => {
                    //
                  }}
                >
                  Sair
                </Menu.Item>
              </Fragment>
            }
            logo={archbaseLogo3}
          />
        }
      >
        <ArchbaseAdminTabContainer
          onChangeActiveTabId={(activeTabId: any) => adminStore.setActiveTabId(activeTabId)}
          onChangeOpenedTabs={(openedTabs: ArchbaseTabItem[]) => {
            adminStore.setOpenedTabs(openedTabs)
          }}
          openedTabs={adminStore.openedTabs}
          activeTabId={adminStore.activeTabId}
          navigationData={navigationDataSampleWithGroup}
        />
      </ArchbaseAdminMainLayout>
    </div>
  )
}

const meta: Meta<typeof ArchbaseAdminMainLayout> = {
  title: 'Admin/Main layout',
  component: ArchbaseAdminMainLayout,
}

export default meta
type Story = StoryObj<typeof ArchbaseAdminMainLayout>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseAdminMainLayoutExample />,
}
