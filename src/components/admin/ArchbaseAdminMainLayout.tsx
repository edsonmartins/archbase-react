import {
  ActionIcon,
  AppShell,
  Container,
  Drawer,
  MantineNumberSize,
  MantineTheme,
  ScrollArea,
  px,
  useMantineTheme,
} from '@mantine/core';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import { Menu as SidebarMenu, menuClasses, MenuItem, Sidebar, sidebarClasses, SubMenu } from 'react-pro-sidebar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { ArchbaseUser } from '../auth/ArchbaseUser';
import {
  ArchbaseAdminLayoutContext,
  ArchbaseAdminLayoutContextValue,
  ArchbaseAdminLayoutProvider,
} from './ArchbaseAdminLayout.context';
import { useArchbaseVisible } from '../hooks/useArchbaseVisible';
import i18next from 'i18next';
import { useMediaQuery } from 'usehooks-ts';

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
  sideBarWidth?: string | number;
  sideBarCollapsedWidth?: string | number;
  sideBarHiddenBreakPoint?: string | number;
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

function buildNavbar(
  sidebarRef: React.Ref<HTMLHtmlElement>,
  theme: MantineTheme,
  adminLayoutContextValue: ArchbaseAdminLayoutContextValue,
  sideBarWidth: string | number,
  sideBarCollapsedWidth: string | number,
  menuItemStyles: MenuItemStyles,
  links: ReactNode,
  isHidden: boolean,
) {
  return (
    <Sidebar
      ref={sidebarRef}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          position: 'absolute',
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          overflowX: 'hidden',
          bottom: 70,
          left: 0,
          right: 0,
          top: isHidden ? 0 : 60,
          height: 'calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))',
          paddingTop: '10px',
          paddingBottom: '20px',
        },
        [`.${sidebarClasses.root}`]: {
          borderColor: 'red',
        },
      }}
      collapsed={adminLayoutContextValue.collapsed}
      width={`${sideBarWidth}`}
      collapsedWidth={`${sideBarCollapsedWidth}`}
    >
      <SidebarMenu menuItemStyles={menuItemStyles} closeOnClick={true}>
        {links}
      </SidebarMenu>
    </Sidebar>
  );
}

function buildSetCollapsedButton(
  theme: MantineTheme,
  adminLayoutContextValue: ArchbaseAdminLayoutContextValue,
  sideBarWidth: string | number,
  sideBarCollapsedWidth: string | number,
  handleCollapseSidebar: () => void,
) {
  return (
    <div
      style={{
        position: 'absolute',
        left: adminLayoutContextValue.collapsed
          ? `calc(${sideBarCollapsedWidth} - 14px)`
          : `calc(${sideBarWidth} - 14px)`,
        top: 'calc(100vh / 2)',
        zIndex: '9999',
      }}
    >
      <ActionIcon
        bg={theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][4] : theme.colors[theme.primaryColor][4]}
        color={theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6]}
        variant="filled"
        radius="xl"
        onClick={handleCollapseSidebar}
      >
        {adminLayoutContextValue.collapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </ActionIcon>
    </div>
  );
}

function ArchbaseAdminMainLayoutContainer({
  navigationData,
  children,
  header,
  footer,
  sideBarWidth = '280px',
  sideBarCollapsedWidth = '74px',
  sideBarHiddenBreakPoint,
}: ArchbaseAdminMainLayoutProps) {
  const theme = useMantineTheme();
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);

  const navigate = useNavigate();
  const [sidebarRef, sidebarVisible] = useArchbaseVisible<HTMLHtmlElement, boolean>();
  const themes = createThemedStyles(theme);

  const isHidden = useMediaQuery(`(max-width: ${sideBarHiddenBreakPoint ?? theme.breakpoints.md})`);
  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '14px',
      fontWeight: 400,
      background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      color: theme.white,
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
    subMenuContent: () => ({
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
        color: theme.white,
      },
    },

    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      '&:hover': {
        color: theme.white,
      },
    }),
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={() => onMenuItemClick(item)}
            icon={item.icon}
          >
            {`${i18next.t(item.label)}`}
          </MenuItem>
        ),
      );
  }, [navigationData, onMenuItemClick, theme.colorScheme, theme.colors, theme.primaryColor]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationData, adminLayoutContextValue.collapsed]);

  const handleCollapseSidebar = useCallback(() => {
    adminLayoutContextValue.setCollapsed!(!adminLayoutContextValue.collapsed);
  }, [adminLayoutContextValue.setCollapsed, adminLayoutContextValue.collapsed]);

  const handleHiddenSidebar = useCallback(() => {
    adminLayoutContextValue.setHidden!(!adminLayoutContextValue.hidden);
  }, [adminLayoutContextValue.setHidden, adminLayoutContextValue.hidden]);

  useEffect(() => {
    if (adminLayoutContextValue.hidden && !isHidden) {
      handleHiddenSidebar();
    }
  }, [adminLayoutContextValue.hidden, isHidden, handleHiddenSidebar]);

  useEffect(() => {
    if (adminLayoutContextValue.collapsed && isHidden) {
      handleCollapseSidebar();
    }
  }, [adminLayoutContextValue.collapsed, isHidden, handleCollapseSidebar]);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          paddingTop: 'calc(var(--mantine-header-height, 0px) + 0.5rem)',
          paddingBottom: 'calc(var(--mantine-footer-height, 0px) + 0.5rem)',
          paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 0.5rem)',
          paddingRight: 'calc(var(--mantine-aside-width, 0px) + 0.5rem)',
        },
        body: {
          overflow: 'hidden',
        },
      }}
      navbar={
        !isHidden &&
        buildNavbar(
          sidebarRef,
          theme,
          adminLayoutContextValue,
          sideBarWidth,
          sideBarCollapsedWidth,
          menuItemStyles,
          links,
          isHidden,
        )
      }
      footer={footer}
      header={header}
    >
      {!isHidden &&
        buildSetCollapsedButton(
          theme,
          adminLayoutContextValue,
          sideBarWidth,
          sideBarCollapsedWidth,
          handleCollapseSidebar,
        )}
      <div
        style={{
          height: 'calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem) - 1rem)',
          width: `calc(100vw - ${
            isHidden ? '0rem' : adminLayoutContextValue.collapsed ? sideBarCollapsedWidth : sideBarWidth
          } - 1rem)`,
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors[theme.primaryColor][1]
          }`,
          borderRadius: '6px',
          overflow: 'none',
        }}
      >
        {children}
        <div style={{ width: '100%', height: 'calc(100% - 48px)' }}>
          <Routes>{routes}</Routes>
        </div>
      </div>
      <Drawer opened={adminLayoutContextValue.hidden} onClose={handleHiddenSidebar} size={sideBarWidth} padding={0}>
        {buildNavbar(
          sidebarRef,
          theme,
          adminLayoutContextValue,
          sideBarWidth,
          sideBarCollapsedWidth,
          menuItemStyles,
          links,
          isHidden,
        )}
      </Drawer>
    </AppShell>
  );
}

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
