import { ArchbaseAdvancedTab, ArchbaseAdvancedTabs } from '@components/containers/tabs';
import { useContext, useEffect, useRef, useState } from 'react';
import { ArchbaseNavigationItem, ArchbaseTabItem } from './types';
import { useLocation, useNavigate } from 'react-router';
import React from 'react';
import { useMantineTheme } from '@mantine/core';
import useComponentSize from '@rehooks/component-size';
import { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutContextValue } from './ArchbaseAdminLayout.context';

export interface ArchbaseAdminTabContainerProps {
  navigationData: ArchbaseNavigationItem[];
}

export function ArchbaseAdminTabContainer({ navigationData }: ArchbaseAdminTabContainerProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [openedTabs, setOpenedTabs] = useState<ArchbaseTabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<any>();
  const currentLocation = useLocation();
  const tabsRef = useRef<any>([]);
  let size = useComponentSize(tabsRef);
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);

  const getNavigationItemByLink = (link: string): ArchbaseNavigationItem | undefined => {
    let result: ArchbaseNavigationItem | undefined;
    navigationData.forEach((item: ArchbaseNavigationItem) => {
      if (item.link === link) {
        result = item;
      }
      if (item.links) {
        item.links.forEach((subItem) => {
          if (subItem.link === link) {
            result = subItem;
          }
        });
      }
    });
    return result;
  };

  useEffect(() => {
    setOpenedTabs(openedTabs);
  }, [size]);

  useEffect(() => {
    const item: ArchbaseNavigationItem | undefined = getNavigationItemByLink(currentLocation.pathname);
    if (item) {
      const index = openedTabs.findIndex((tab) => tab.path === item.link);
      if (index !== -1) {
        setActiveTabId(openedTabs[index].id);
      } else {
        const newOpenedTabs = openedTabs.concat({
          id: `${item.link}`,
          title: `${item.label}`,
          path: `${item.link}`,
          active: true,
          content: item.component,
          iconClass: item.icon,
          closeButton: true,
        });
        setOpenedTabs(newOpenedTabs);
        setActiveTabId(`${item.link}`);
      }
    }
  }, [currentLocation.pathname]);

  const handleOnActive = (id: string) => {
    const items = openedTabs.filter((item) => item.id === id);
    if (items && items.length > 0) {
      if (location.pathname != items[0].path) {
        navigate(items[0].path);
      }
    }
    setActiveTabId(id);
  };

  const handleOnClose = (id: string) => {
    console.log('handleOnClose ' + new Date());
    let tmpTabs = openedTabs.filter((f) => f.id !== id);
    let idx = -1;
    openedTabs.forEach((f, index) => f.id === activeTabId && (idx = index));
    let tmpCurrent = tmpTabs.length > 0 ? (tmpTabs[idx] ? tmpTabs[idx].id : tmpTabs[tmpTabs.length - 1].id) : null;
    setOpenedTabs(tmpTabs.map((tab) => ({ ...tab, active: tmpCurrent === tab.id })));
    if (tmpCurrent){
      setActiveTabId(tmpCurrent);
      openedTabs.forEach((f, index) => f.id === tmpCurrent && (idx = index));
      if (idx !== -1){
        navigate(tmpTabs[idx].path);
      }
    } else {
      setActiveTabId(undefined);
      navigate(adminLayoutContextValue.navigationRootLink!);
    }
  };

  const buildAdvancedTabs = (openedTabs: ArchbaseTabItem[]): ArchbaseAdvancedTab[] => {
    return openedTabs.map((tab) => {
      const result: ArchbaseAdvancedTab = { key: tab.id, favicon: tab.iconClass, title: tab.title };
      return result;
    });
  };

  console.log('render ' + location.pathname);

  return (
    <div ref={tabsRef}>
      <ArchbaseAdvancedTabs
        onClick={(key: any) => handleOnActive(key)}
        onTabClose={(key: any) => handleOnClose(key)}
        onTabChange={(_tabs: ArchbaseAdvancedTab[]) => {}}
        currentTabs={buildAdvancedTabs(openedTabs)}
        activeTab={activeTabId}
        dark={theme.colorScheme === 'dark'}
      ></ArchbaseAdvancedTabs>
    </div>
  );
}
