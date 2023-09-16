import {
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Center,
  Flex,
  Group,
  Header,
  Image,
  MediaQuery,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  createStyles,
  rem,
  useMantineTheme
} from '@mantine/core'
import React, { CSSProperties, Component, ReactNode, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconTerminal, IconSearch } from '@tabler/icons-react'
import {
  SpotlightAction,
  SpotlightActionProps,
  SpotlightProvider,
  spotlight
} from '@mantine/spotlight'
import { ArchbaseUser } from '../auth/ArchbaseUser'
import { ArchbaseNavigationItem, ArchbaseOwner, ArchbaseCompany } from './types'
import { ArchbaseHeaderNavAction } from './ArchbaseHeaderNavAction'
import { ArchbaseColorSchemeAction } from './ArchbaseColorSchemeAction'
import {
  ArchbaseAdminLayoutContext,
  ArchbaseAdminLayoutContextValue
} from './ArchbaseAdminLayout.context'
import i18next from 'i18next'
import { ArchbaseChangeLanguageAction } from './ArchbaseChangeLanguageAction'

export const defaultAvatar =
  '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'

const useStyles = createStyles((theme) => ({
  action: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: `${rem(10)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }),

    '&[data-hovered]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }
  }
}))

function CustomCommand({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const { classes } = useStyles(undefined, { styles, classNames, name: 'Spotlight' })

  return (
    <UnstyledButton
      className={classes.action}
      data-hovered={hovered || undefined}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap>
        {action.category && <Badge color={action.color.backgroundColor}>{`${i18next.t(action.category)}`}</Badge>}
        {action.image && (
          <Center>
            <Image src={action.image} alt={`${i18next.t(action.title)}`} width={50} height={50} />
          </Center>
        )}

        <div style={{ flex: 1 }}>
          <Text>{`${i18next.t(action.title)}`}</Text>

          {action.description && (
            <Text color="dimmed" size="xs">
              {`${i18next.t(action.description)}`}
            </Text>
          )}
        </div>
      </Group>
    </UnstyledButton>
  )
}

interface CommandPaletteButtonProps {
  commands: SpotlightAction[]
  theme: string
}

interface CommandPaletteButtonState {
  commandOpen: boolean
}

class CommandPaletteButton extends Component<CommandPaletteButtonProps, CommandPaletteButtonState> {
  constructor(props: CommandPaletteButtonProps) {
    super(props)
    this.state = { commandOpen: false }
  }

  onButtonClick = (_event) => {
    this.setState({ ...this.state, commandOpen: !this.state.commandOpen })
  }

  onRequestClose = () => {
    this.setState({ ...this.state, commandOpen: false })
  }

  onAfterOpen = () => {
    this.setState({ ...this.state, commandOpen: true })
  }

  render() {
    return (
      <SpotlightProvider
        shortcut={['mod + M', '/']}
        limit={12}
        searchPlaceholder="Localizar..."
        searchIcon={<IconSearch size="1.2rem" />}
        actions={this.props.commands}
        actionComponent={CustomCommand}
      >
        <Tooltip withinPortal withArrow label="Comandos ⌘M">
          <Button leftIcon={<IconTerminal size="24px" />} onClick={() => spotlight.open()}></Button>
        </Tooltip>
      </SpotlightProvider>
    )
  }
}

export type ArchbaseAdminLayoutHeaderProps = {
  logo: string
  styleLogo?: CSSProperties;
  userMenuItems: ReactNode
  user?: ArchbaseUser
  owner?: ArchbaseOwner
  company?: ArchbaseCompany
  navigationData: ArchbaseNavigationItem[] | undefined
  headerActions?: ReactNode | ReactNode[]
  color?: string,
  showLanguageSelector?: boolean
}

export const ArchbaseAdminLayoutHeader: React.FC<ArchbaseAdminLayoutHeaderProps> = ({
  userMenuItems,
  user,
  navigationData: navigationItems,
  logo,
  color,
  headerActions,
  styleLogo,
  showLanguageSelector = false
}) => {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(
    ArchbaseAdminLayoutContext
  )

  const commands = useMemo(() => {
    const result = new Array<SpotlightAction>()
    if (navigationItems) {
      navigationItems.forEach((item) => {
        if (item.links) {
          item.links.forEach((subItem) => {
            result.push({
              category: subItem.category ? subItem.category!.toUpperCase() : '',
              color: { backgroundColor: subItem.color, color: 'white' },
              title: subItem.label,
              link: subItem.link,
              onTrigger: () => {
                return navigate(subItem.link!)
              }
            })
          })
        } else {
          result.push({
            onTrigger: () => {
              return navigate(item.link!)
            },
            category: item.category ? item.category!.toUpperCase() : '',
            color: { backgroundColor: item.color, color: 'white' },
            title: item.label,
            link: item.link
          })
        }
      })
    }
    return result
  }, [navigationItems, navigate])

  return (
    <Header
      height={60}
      p="xs"
      color={color}
      display="flex"
      style={{
        backgroundColor: theme.colors[theme.primaryColor][8],
        alignItems: 'center'
      }}
    >
      <Flex sx={{ width: 300, height: 50 }} align={'center'}>
        <img
          style={{
            height: 50,
            ...styleLogo
          }}
          src={logo}
        />
      </Flex>
      <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
        <Burger
          opened={adminLayoutContextValue.collapsed ? adminLayoutContextValue.collapsed : false}
          onClick={() => adminLayoutContextValue.setCollapsed!(!adminLayoutContextValue.collapsed)}
          size="sm"
          color={theme.colors.gray[7]}
          mx="xl"
        />
      </MediaQuery>
      <div>
        {commands && commands.length > 0 ? (
          <CommandPaletteButton commands={commands} theme={theme.colorScheme} />
        ) : null}
      </div>
      <Box sx={{ flex: 1 }} />
      <ArchbaseHeaderNavAction>
        {headerActions}
        <ArchbaseColorSchemeAction />
        {showLanguageSelector?<ArchbaseChangeLanguageAction/>:null}
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Avatar
              style={{ cursor: 'pointer' }}
              radius="xl"
              src={user ? user.photo : defaultAvatar}
              alt={user ? user.displayName : ''}
            />
          </Menu.Target>

          <Menu.Dropdown>{userMenuItems}</Menu.Dropdown>
        </Menu>
      </ArchbaseHeaderNavAction>
    </Header>
  )
}

