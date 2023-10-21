import {
  AppShell,
  Box,
  Container,
  Drawer,
  MantineNumberSize,
  ScrollArea,
  Text,
  px,
  useMantineTheme,
} from '@mantine/core';
import React, { Fragment, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { menuClasses, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
import { buildNavbar } from './buildNavbar';
import { buildSetCollapsedButton } from './buildSetCollapsedButton';
import { buildMenuItemStyles } from './buildMenuItemStyles';

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
  sideBarFooterHeight?: string | number;
  sideBarFooterContent?: ReactNode;
  onCollapsedSideBar?: (collapsed: boolean)=>void;
  onHiddenSidebar?: (hidden: boolean)=>void;
}

function ArchbaseAdminMainLayoutContainer({
  navigationData,
  children,
  header,
  footer,
  sideBarWidth = '360px',
  sideBarCollapsedWidth = '74px',
  sideBarHiddenBreakPoint,
  sideBarFooterHeight,
  sideBarFooterContent,
  onCollapsedSideBar,
  onHiddenSidebar
}: ArchbaseAdminMainLayoutProps) {
  const theme = useMantineTheme();
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);
  const navigate = useNavigate();
  const [sidebarRef, sidebarVisible] = useArchbaseVisible<HTMLHtmlElement, boolean>();
  const isHidden = useMediaQuery(`(max-width: ${sideBarHiddenBreakPoint ?? theme.breakpoints.md})`);

  const menuItemStyles = buildMenuItemStyles(theme)

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
            disabled={item.disabled}
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
  }, [navigationData, adminLayoutContextValue.collapsed]);

  const handleCollapseSidebar = useCallback(() => {
    adminLayoutContextValue.setCollapsed!(!adminLayoutContextValue.collapsed);
    if (onCollapsedSideBar){
      onCollapsedSideBar(!adminLayoutContextValue.collapsed)
    }
  }, [adminLayoutContextValue.setCollapsed, adminLayoutContextValue.collapsed]);

  const handleHiddenSidebar = useCallback(() => {
    adminLayoutContextValue.setHidden!(!adminLayoutContextValue.hidden);
    if (onHiddenSidebar){
      onHiddenSidebar(!adminLayoutContextValue.hidden)
    }
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
        !isHidden ?
        buildNavbar(
          sidebarRef,
          theme,
          adminLayoutContextValue,
          sideBarWidth,
          sideBarCollapsedWidth,
          menuItemStyles,
          links,
          isHidden,
          sideBarFooterHeight ? `calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem) - ${sideBarFooterHeight}px)` : `calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))`,
          sideBarFooterHeight,
          sideBarFooterContent,
        ):undefined
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
      <Drawer opened={adminLayoutContextValue.hidden||false} onClose={handleHiddenSidebar} size={sideBarWidth} padding={0}>
        {buildNavbar(
          sidebarRef,
          theme,
          adminLayoutContextValue,
          sideBarWidth,
          sideBarCollapsedWidth,
          menuItemStyles,
          links,
          isHidden,
          sideBarFooterHeight ? `calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem) - ${sideBarFooterHeight}px)` : `calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))`,
          sideBarFooterHeight,
          sideBarFooterContent
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
  sideBarWidth,
  sideBarCollapsedWidth,
  sideBarHiddenBreakPoint,
  sideBarFooterHeight,
  sideBarFooterContent,
  onCollapsedSideBar,
  onHiddenSidebar
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
        sideBarWidth={sideBarWidth}
        sideBarCollapsedWidth={sideBarCollapsedWidth}
        sideBarHiddenBreakPoint={sideBarHiddenBreakPoint}
        sideBarFooterHeight={sideBarFooterHeight}
        sideBarFooterContent={sideBarFooterContent}
        onCollapsedSideBar={onCollapsedSideBar}
        onHiddenSidebar={onHiddenSidebar}
      >
        {children}
      </ArchbaseAdminMainLayoutContainer>
    </ArchbaseAdminLayoutProvider>
  );
}
