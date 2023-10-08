import React, { useState } from 'react'
import { Button, ColorScheme, Group, Stack } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { Meta, StoryObj } from '@storybook/react'

import { ArchbaseAdvancedTabs, ArchbaseAdvancedTabItem } from './ArchbaseAdvancedTabs'

const ArchbaseAdvancedTabsExample = () => {
  const [tabs, setTabs] = useState<ArchbaseAdvancedTabItem[]>([
    { key: 0, favicon: 'https://www.google.com/favicon.ico', title: 'Google' },
    {
      key: 1,
      favicon: 'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico',
      title: 'Facebook',
    },
    { key: 2, favicon: 'https://it108.wke.csie.ncnu.edu.tw/edu.ico', title: 'IT Technology' },
  ])
  const [colorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })
  const [key, setID] = useState(2)
  const [current, setCurrent] = useState(0)

  const addTab = (isCurrent: any) => {
    const tab: ArchbaseAdvancedTabItem[] = [
      { key: key + 1, title: 'Nova Tab', favicon: 'https://it108.wke.csie.ncnu.edu.tw/edu.ico' },
    ]
    const tmpTabs = tabs.concat(tab)
    !!isCurrent && setCurrent(key + 1)
    setID(key + 1)
    setTabs(tmpTabs)
  }

  const onClose = (key: any) => {
    const tmpTabs = tabs.filter((f) => f.key !== key)
    let idx = -1
    tabs.forEach((f, index) => f.key === current && (idx = index))
    const isCurrent = tmpTabs.filter((f) => f.key === current).length > 0 ? true : false
    const tmpCurrent = tmpTabs.length > 0 ? (tmpTabs[idx] ? tmpTabs[idx].key : tmpTabs[tmpTabs.length - 1].key) : null
    !isCurrent && setCurrent(tmpCurrent)
    setTabs(tmpTabs)
  }

  return (
    <div className={`root ${colorScheme === 'light' ? '' : ' dark-theme'}`}>
      <ArchbaseAdvancedTabs
        currentTabs={tabs}
        dark={colorScheme === 'dark'}
        activeTab={current}
        onClick={(key: any) => setCurrent(key)}
        onTabClose={(key: any) => onClose(key)}
        onTabChange={(tabs: ArchbaseAdvancedTabItem[]) => setTabs(tabs)}
        buttonCloseOnlyActiveTab={true}
      />
      <Stack h={80} align="center" justify="center" spacing="lg">
        <Group spacing="lg">
          <Button onClick={(_e) => addTab(true)} data-add-tab>
            Adicionar nova Tab
          </Button>
          <Button onClick={(_e) => addTab(true)} data-add-background-tab>
            Adicionar nova Tab em background
          </Button>
          <Button onClick={(_e) => onClose(current)} data-remove-tab>
            Remover Tab ativa
          </Button>
        </Group>
      </Stack>
    </div>
  )
}

const meta: Meta<typeof ArchbaseAdvancedTabs> = {
  title: 'Contêiner/Advanced Tabs',
  component: ArchbaseAdvancedTabs,
}

export default meta
type Story = StoryObj<typeof ArchbaseAdvancedTabs>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseAdvancedTabsExample />,
}
