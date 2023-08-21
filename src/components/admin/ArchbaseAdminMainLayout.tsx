import { ActionIcon, AppShell, MantineTheme,  useMantineTheme } from '@mantine/core';
import React, { ReactNode, useContext, useMemo } from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import { Menu as SidebarMenu, menuClasses, MenuItem, Sidebar, sidebarClasses, SubMenu } from 'react-pro-sidebar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { ArchbaseUser } from '../../components/auth/ArchbaseUser';
import { useArchbaseVisible } from '../../components/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import {
  ArchbaseAdminLayoutContext,
  ArchbaseAdminLayoutContextValue,
  ArchbaseAdminLayoutProvider,
} from '../../components/admin/ArchbaseAdminLayout.context';

export interface ArchbaseAdminMainLayoutProps {
  navigationData: ArchbaseNavigationItem[];
  user?: ArchbaseUser;
  owner?: ArchbaseOwner;
  company?: ArchbaseCompany;
  navigationRootLink: string;
  userMenuItems?: ReactNode | ReactNode[];
  children?: ReactNode;
  /** <Header /> component */
  header?: React.ReactElement;
  /** <Footer /> component */
  footer?: React.ReactElement;
}

const createThemedStyles = (_IDtheme: MantineTheme): any => {
  return {
    light: {
      sidebar: {
        backgroundColor: '#ffffff',
        color: '#607489',
      },
      menu: {
        menuContent: '#fbfcfd',
        icon: '#0098e5',
        hover: {
          backgroundColor: '#c5e4ff',
          color: '#44596e',
        },
        disabled: {
          color: '#9fb6cf',
        },
      },
    },
    dark: {
      sidebar: {
        backgroundColor: '#0b2948',
        color: '#8ba1b7',
      },
      menu: {
        menuContent: '#082440',
        icon: '#59d0ff',
        hover: {
          backgroundColor: '#00458b',
          color: '#b6c8d9',
        },
        disabled: {
          color: '#3e5e7e',
        },
      },
    },
  };
};

export function ArchbaseAdminMainLayout({
  navigationRootLink = '/',
  navigationData,
  user,
  children,
  header,
  footer,
  owner,
  company,
}: ArchbaseAdminMainLayoutProps) {
  return (
    <ArchbaseAdminLayoutProvider
      navigationData={navigationData}
      navigationRootLink={navigationRootLink}
      user={user}
      owner={owner}
      company={company}
    >
      <ArchbaseAdminMainLayoutContainer
        navigationRootLink={navigationRootLink}
        navigationData={navigationData}
        user={user}
        header={header}
        footer={footer}
        owner={owner}
        company={company}
      >
        {children}
      </ArchbaseAdminMainLayoutContainer>
    </ArchbaseAdminLayoutProvider>
  );
}

function ArchbaseAdminMainLayoutContainer({ navigationData, children, header, footer }: ArchbaseAdminMainLayoutProps) {
  const theme = useMantineTheme();
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);

  const navigate = useNavigate();
  const [sidebarRef, sidebarVisible] = useArchbaseVisible<HTMLHtmlElement, boolean>();
  const themes = createThemedStyles(theme);

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '14px',
      fontWeight: 400,
      background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : 'white',
      color: 'white',
    },
    icon: {
      background:
        theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][0],
      color: theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][0] : theme.colors[theme.primaryColor][7],
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme.colorScheme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({}) => ({
      width: '280px',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors[theme.primaryColor][0],
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme.colorScheme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6],
        color: 'white',
      },
    },

    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
      color: theme.colorScheme === 'dark' ? 'white' : 'black',
      '&:hover': {
        color: 'white',
      },
    }),
  };

  const onMenuItemClick = (item: ArchbaseNavigationItem) => {
    if (item.link) {
      navigate(item.link!);
    }
  };
  const links = useMemo(() => {
    return navigationData
      .filter((itm) => itm.showInSidebar === true)
      .map((item, index) =>
        item.links ? (
          <SubMenu
            rootStyles={{
              fontSize: '16px',
            }}
            key={index}
            id={item.label}
            icon={item.icon}
            label={item.label}
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
                  >
                    {subItem.label}
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
            onClick={() => onMenuItemClick(item)}
            icon={item.icon}
          >
            {item.label}
          </MenuItem>
        ),
      );
  }, [navigationData]);

  const routes = useMemo(() => {
    return navigationData.map((item, index) =>
      item.links ? (
        item.links.map((item2, indexSub) => (
          <Route path={item2.link} key={`${item2.link}_${indexSub}`} element={item2.component} />
        ))
      ) : (
        <Route key={`${item.link}_${index}`} path={item.link} element={item.component} />
      ),
    );
  }, [navigationData, adminLayoutContextValue.collapsed]);

  const handleCollapseSidebar = () => {
    adminLayoutContextValue.setCollapsed!(!adminLayoutContextValue.collapsed);
  };

  const containerBB = {
    left: !adminLayoutContextValue.collapsed ? '284px' : '76px',
    top: '62px',
    bottom: '62px',
    right: '2px',
    display: !sidebarVisible ? 'none' : 'inherit',
  };

  const heightContainer = 'calc(100% - 46px)';

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
        body: {
          overflow: 'hidden',
        },
      }}
      navbarOffsetBreakpoint="lg"
      navbar={
        <Sidebar
          ref={sidebarRef}
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              position: 'absolute',
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
              boottom: '70px',
              left: 0,
              right: 0,
              top: '70px',
              paddingTop: '10px',
              paddingBottom: '10px',
            },
            [`.${sidebarClasses.root}`]: {
              borderColor: 'red',
            },
          }}
          collapsed={adminLayoutContextValue.collapsed}
          breakPoint="lg"
          width="280px"
          collapsedWidth={'74px'}
        >
          <SidebarMenu menuItemStyles={menuItemStyles} closeOnClick={true}>
            {links}
          </SidebarMenu>
        </Sidebar>
      }
      footer={footer}
      header={header}
    >
      <div
        style={{
          position: 'absolute',
          left: adminLayoutContextValue.collapsed ? '60px' : '266px',
          top: 'calc(100vh / 2)',
          zIndex: '9999',
        }}
      >
        <ActionIcon
          bg={theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][4] : theme.colors[theme.primaryColor][4]}
          color={
            theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6]
          }
          variant="filled"
          radius="xl"
          onClick={handleCollapseSidebar}
        >
          {adminLayoutContextValue.collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </ActionIcon>
      </div>
      <div
        style={{
          position: 'absolute',
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors[theme.primaryColor][1]
          }`,
          borderRadius: '6px',
          top: containerBB.top,
          left: containerBB.left,
          bottom: containerBB.bottom,
          right: containerBB.right,
        }}
      >
        {children}
        <div
          style={{
            padding: '10px',
            height: heightContainer,
            width: '100%',
            overflow: 'auto',
          }}
        >
          <Routes>{routes}</Routes>
        </div>
      </div>
    </AppShell>
  );
}
