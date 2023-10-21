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
import { ArchbaseAdvancedSidebar } from './ArchbaseAdvancedSidebar'

const ArchbaseAdvancedSidebarExample = () => {
  const adminStore = useArchbaseAdminStore()

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ArchbaseAdvancedSidebar
        navigationData={navigationDataSampleWithGroup}
        sidebarHeight={'800px'}
        sidebarGroupWidth={'90px'}
        selectedGroupColor="#132441"
        groupColor='white'
        backgroundGroupColor='#132441'
        groupLabelDarkColor='white'
        groupLabelLightColor='white'
      />
    </div>
  )
}

const ArchbaseAdvancedSidebarWithouLabelExample = () => {
  const adminStore = useArchbaseAdminStore()

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ArchbaseAdvancedSidebar
        navigationData={navigationDataSampleWithGroup}
        sidebarHeight={'800px'}
        sidebarGroupWidth={'60px'}
        selectedGroupColor="#132441"
        groupColor='white'
        backgroundGroupColor='#132441'
        groupLabelDarkColor='white'
        groupLabelLightColor='white'
        showGroupLabels={false}
      />
    </div>
  )
}

const meta: Meta<typeof ArchbaseAdvancedSidebar> = {
  title: 'Admin/Multi sidebar',
  component: ArchbaseAdvancedSidebar,
}

export default meta
type Story = StoryObj<typeof ArchbaseAdvancedSidebar>

export const Primary: Story = {
  name: 'Exemplo com label e fundo customizado',
  render: () => <ArchbaseAdvancedSidebarExample />,
}

export const WithoutLabel: Story = {
  name: 'Exemplo sem label e fundo customizado',
  render: () => <ArchbaseAdvancedSidebarWithouLabelExample />,
}