import React, { ReactNode, useMemo, useState } from 'react'
import { ActionIcon, Box, MantineTheme, Paper, Stack, Text, Tooltip } from '@mantine/core'
import { ArchbaseNavigationGroup, ArchbaseNavigationItem } from './types'
import { Menu as SidebarMenu, MenuItem, Sidebar, SubMenu, menuClasses, sidebarClasses } from 'react-pro-sidebar'
import i18next from 'i18next'
import { buildMenuItemStyles } from './buildMenuItemStyles'
import { IconDots } from '@tabler/icons-react'

export interface ArchbaseAdvancedSidebarProps {
  navigationData: ArchbaseNavigationItem[]
  sidebarWidth?: string | undefined
  sidebarHeight?: string | undefined
  sidebarGroupWidth?: string | undefined
  onMenuItemClick?: (item: ArchbaseNavigationItem) => void
  onSelectGroup?: () => void
  selectedGroupColor?: string
  groupColor?: string
  groupLabelDarkColor?: string
  groupLabelLightColor?: string
  backgroundGroupColor?: string
  isHidden?: boolean
  sideBarFooterHeight?: string | number | undefined
  sideBarFooterContent?: ReactNode | undefined
  collapsed?: boolean
  withBorder?: boolean
  showGroupLabels?: boolean
  margin?: string
  theme: MantineTheme
  sidebarRef?: React.Ref<HTMLHtmlElement> | undefined
}

type GroupItemSidebar = {
  name: string
  indexOrder: number
  component: ReactNode
  links?: ReactNode | undefined
}

export function ArchbaseAdvancedSidebar({
  navigationData,
  sidebarGroupWidth = '80px',
  sidebarWidth = '360px',
  sidebarHeight = '100%',
  selectedGroupColor,
  groupColor,
  backgroundGroupColor,
  isHidden = false,
  sideBarFooterHeight,
  sideBarFooterContent,
  groupLabelDarkColor,
  groupLabelLightColor,
  collapsed,
  onMenuItemClick,
  onSelectGroup,
  withBorder = true,
  showGroupLabels = true,
  margin,
  theme,
  sidebarRef,
}: ArchbaseAdvancedSidebarProps) {
  const [activeGroupName, setActiveGroupName] = useState<string>('')

  const color = selectedGroupColor
    ? selectedGroupColor
    : theme.colorScheme === 'dark'
    ? theme.colors[theme.primaryColor][8]
    : theme.colors[theme.primaryColor][0]

  const groups = useMemo(() => {
    const result: Set<GroupItemSidebar> = new Set()
    navigationData.forEach((item) => {
      if (item.showInSidebar) {
        let found = false
        if (!item.group) {
          item.group = {
            icon: <IconDots size="2.2rem" color="#63B1FB" stroke={1} />,
            label: 'Default',
            name: 'Default',
            hint: 'Default',
            indexOrder: 0,
          }
        }
        result.forEach((it) => {
          if (it.name === item.group.name) {
            found = true
          }
        })
        if (!found) {
          result.add({
            name: item.group.name,
            indexOrder: item.group.indexOrder,
            component: (
              <Tooltip key={item.group.name} content={item.group.hint} label={item.group.label}>
                <Stack
                  spacing="2px"
                  style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <ActionIcon
                    size="48px"
                    variant={item.group.name === activeGroupName ? 'filled' : backgroundGroupColor ? 'subtle' : 'light'}
                    color={item.group.name === activeGroupName ? color : groupColor}
                    onClick={() => {
                      setActiveGroupName((prev) => {
                        if (item.group.name === prev) {
                          return ''
                        }

                        return item.group.name
                      })

                      if (onSelectGroup && !collapsed) {
                        onSelectGroup()
                      }
                    }}
                  >
                    {item.group.icon}
                  </ActionIcon>
                  {showGroupLabels ? (
                    <Text
                      size="xs"
                      color={
                        theme.colorScheme === 'dark'
                          ? groupLabelDarkColor
                            ? groupLabelDarkColor
                            : theme.colors[theme.primaryColor][2]
                          : groupLabelLightColor
                          ? groupLabelLightColor
                          : theme.colors[theme.primaryColor][2]
                      }
                    >
                      {item.group.label}
                    </Text>
                  ) : null}
                </Stack>
              </Tooltip>
            ),
          })
        }
      }
    })
    result.forEach((group) => {
      group.links = navigationData
        .filter((itm) => itm.showInSidebar === true && itm.group && itm.group.name === group.name)
        .map((item, index) =>
          item.links ? (
            <SubMenu
              rootStyles={{
                fontSize: '16px',
              }}
              key={index}
              id={item.label}
              icon={item.icon}
              defaultOpen={true}
              label={`${i18next.t(item.label)}`}
              disabled={item.disabled}
            >
              {item.links &&
                item.links
                  .filter((itm) => itm.showInSidebar === true)
                  .map((subItem, subIndex) => (
                    <MenuItem
                      onClick={() => onMenuItemClick(subItem)}
                      rootStyles={{
                        [`.${menuClasses.icon}`]: {
                          background:
                            theme.colorScheme === 'dark'
                              ? theme.colors[theme.primaryColor][8]
                              : theme.colors[theme.primaryColor][7],
                          color:
                            theme.colorScheme === 'dark'
                              ? theme.colors[theme.primaryColor][0]
                              : theme.colors[theme.primaryColor][0],
                        },
                      }}
                      key={subIndex}
                      id={subItem.label}
                      icon={subItem.icon}
                      disabled={subItem.disabled}
                    >
                      {`${i18next.t(subItem.label)}`}
                    </MenuItem>
                  ))}
            </SubMenu>
          ) : (
            <MenuItem
              rootStyles={{
                fontSize: '16px',
              }}
              key={index}
              id={item.label}
              disabled={item.disabled}
              onClick={() => onMenuItemClick(item)}
              icon={item.icon}
            >
              {`${i18next.t(item.label)}`}
            </MenuItem>
          ),
        )
    })

    const grps = [...result].sort((a, b) => a.indexOrder - b.indexOrder)

    return grps
  }, [navigationData, activeGroupName, theme.colorScheme])

  const menuItemStyles = buildMenuItemStyles(theme)

  const sidebarWidthCalculated =
    collapsed || activeGroupName === '' ? '0px' : `calc(${sidebarWidth} - ${sidebarGroupWidth}`

  const calcBackgroundGroupColor = backgroundGroupColor
    ? backgroundGroupColor
    : theme.colorScheme === 'dark'
    ? theme.colors[theme.primaryColor][6]
    : theme.colors[theme.primaryColor][7]

  return (
    <Paper withBorder={withBorder} style={{ display: 'flex', height: sidebarHeight, width: sidebarWidth, margin }}>
      <Stack
        spacing="4px"
        style={{
          height: sidebarHeight,
          width: sidebarGroupWidth,
          padding: '4px',
          backgroundColor: calcBackgroundGroupColor,
        }}
      >
        {groups.map((item) => item.component)}
      </Stack>
      <Box style={{ height: sidebarHeight, width: sidebarWidthCalculated }}>
        {activeGroupName !== '' ? (
          <Sidebar
            ref={sidebarRef}
            rootStyles={{
              [`.${sidebarClasses.container}`]: {
                background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                overflowX: 'hidden',
                left: 0,
                height: '100%',
              },
              [`.${sidebarClasses.root}`]: {
                borderColor: 'red',
              },
            }}
            collapsed={collapsed}
            width="100%"
            collapsedWidth="0px"
          >
            <div id="alooo" style={{ overflowY: 'auto', overflowX: 'hidden', height: '100%' }}>
              <SidebarMenu menuItemStyles={menuItemStyles} closeOnClick={true}>
                {groups.map((item) => {
                  if (item.name === activeGroupName) {
                    return item.links
                  }
                })}
              </SidebarMenu>
            </div>
            {sideBarFooterContent ?? sideBarFooterContent}
          </Sidebar>
        ) : null}
      </Box>
    </Paper>
  )
}
