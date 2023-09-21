import React, { ReactNode, useContext, useEffect, useRef, useState, useTransition } from 'react';
import useComponentSize from '@rehooks/component-size';
import { useLocation, useNavigate } from 'react-router';
import { useMantineTheme } from '@mantine/core';
import { ArchbaseAdvancedTabItem, ArchbaseAdvancedTabs } from '../containers/tabs';
import { ArchbaseNavigationItem, ArchbaseTabItem } from './types';
import { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutContextValue } from './ArchbaseAdminLayout.context';
import { matchPath } from 'react-router';
import i18next from 'i18next';
import { ArchbaseNavigationContext, useArchbaseNavigationContext } from './ArchbaseNavigation.context';

export interface ArchbaseAdminTabContainerProps {
  navigationData: ArchbaseNavigationItem[];
  onChangeActiveTabId?: (activeTabId: any) => void;
  onChangeOpenedTabs?: (openedTabs: ArchbaseTabItem[]) => void;
  activeTabId?: any;
  openedTabs?: ArchbaseTabItem[];
}

interface ResultItem {
  item: ArchbaseNavigationItem | undefined;
  title: string | undefined;
  link: string;
  redirect?: string;
}

export function ArchbaseAdminTabContainer({
  navigationData,
  onChangeOpenedTabs,
  onChangeActiveTabId,
  activeTabId: defaultActiveTabId,
  openedTabs: defaultOpenedTabs = [],
}: ArchbaseAdminTabContainerProps) {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [openedTabs, setOpenedTabs] = useState<ArchbaseTabItem[]>(defaultOpenedTabs);
  const [activeTabId, setActiveTabId] = useState<any>(defaultActiveTabId);
  const currentLocation = useLocation();
  const tabsRef = useRef<any>([]);
  const size = useComponentSize(tabsRef);
  const { state, dispatch } = useArchbaseNavigationContext();
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);

  const handleOnClose = (id: string) => {
    const closedIndex = openedTabs.findIndex((tab) => tab.path === id);
    let redirect: string | undefined;
    if (closedIndex >= 0) {
      redirect = openedTabs[closedIndex].redirect;
    }
    const tmpTabs = openedTabs.filter((f) => f.id !== id);
    let idx = -1;
    tmpTabs.forEach((f, index) => f.id === activeTabId && (idx = index));
    let tmpCurrent: string | null = null;
    if (tmpTabs.length > 0 && tmpTabs[idx]) {
      tmpCurrent = tmpTabs[idx].id;
    } else if (tmpTabs.length > 0) {
      tmpCurrent = tmpTabs[tmpTabs.length - 1].id;
    } else {
      tmpCurrent = null;
    }
    const nextTabs = tmpTabs.map((tab) => ({ ...tab, active: tmpCurrent === tab.id }));
    setOpenedTabs(nextTabs);
    onChangeOpenedTabs && onChangeOpenedTabs(nextTabs);
    if (tmpCurrent && tmpCurrent != null) {
      setActiveTabId(tmpCurrent);
      onChangeActiveTabId && onChangeActiveTabId(tmpCurrent);
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(tmpCurrent);
      }
    } else {
      setActiveTabId(undefined);
      onChangeActiveTabId && onChangeActiveTabId(undefined);
      navigate(adminLayoutContextValue.navigationRootLink!);
    }
  };

  useEffect(() => {
    if (state?.linkClosed) {
      handleOnClose(state?.linkClosed);
    }
  }, [state?.linkClosed]);

  const getNavigationItemByLink = (link: string): ResultItem => {
    let result: ResultItem = { item: undefined, title: undefined, link, redirect: undefined };
    navigationData.forEach((item) => {
      if (item.links) {
        item.links.forEach((subItem) => {
          const found = matchPath({ path: subItem.link || '' }, location.pathname);
          if (found) {
            result.item = subItem;
            result.title = `${i18next.t(subItem.label)}`;
            result.redirect = subItem.redirect;
          }
        });
      } else if (item.link && !result.item) {
        const found = matchPath({ path: item.link }, location.pathname);
        if (found) {
          if (found.params) {
            result.title = `${found.params[Object.keys(found.params)[0]]}`;
          } else {
            result.title = `${i18next.t(item.label)}`;
          }
          result.redirect = item.redirect;
          result.item = item;
        }
      }
    });

    return result;
  };

  useEffect(() => {
    setOpenedTabs(defaultOpenedTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultOpenedTabs)]);

  useEffect(() => {
    const resultItem: ResultItem = getNavigationItemByLink(currentLocation.pathname);
    if (resultItem && resultItem.item) {
      const index = openedTabs.findIndex((tab) => tab.path === resultItem.link);
      if (index !== -1) {
        openedTabs[index].title = resultItem.title!;
        setActiveTabId(openedTabs[index].id);
        onChangeActiveTabId && onChangeActiveTabId(openedTabs[index].id);
      } else {
        setOpenedTabs((prevTabs) => {
          prevTabs.push({
            id: `${resultItem.link}`,
            title: `${resultItem.title}`,
            path: `${resultItem.link}`,
            active: true,
            content: resultItem.item!.component,
            iconClass: resultItem.item!.icon,
            closeButton: true,
            redirect: resultItem.redirect,
          });
          onChangeOpenedTabs && onChangeOpenedTabs(openedTabs);
          setActiveTabId(`${resultItem.link}`);

          return prevTabs;
        });
      }
    }
  }, [currentLocation.pathname]);

  const handleOnActive = (id: string) => {
    const items = openedTabs.filter((item) => item.id === id);
    if (items && items.length > 0) {
      if (currentLocation.pathname !== items[0].path) {
        navigate(items[0].path);
      }
    }
    startTransition(() => {
      setActiveTabId(id);
      onChangeActiveTabId && onChangeActiveTabId(id);
    });
  };

  const handleOnCloseRequest = (id: string) => {
    dispatch({ type: 'USER_CLOSE_REQUEST', link: id });
  };

  const buildAdvancedTabs = (openedTabs: ArchbaseTabItem[]): ArchbaseAdvancedTabItem[] => {
    return openedTabs.map((tab) => {
      const result: ArchbaseAdvancedTabItem = { key: tab.id, favicon: tab.iconClass, title: tab.title };

      return result;
    });
  };

  return (
    <div ref={tabsRef}>
      <ArchbaseAdvancedTabs
        buttonCloseOnlyActiveTab={true}
        onClick={(key: any) => handleOnActive(key)}
        onTabClose={(key: any) => handleOnCloseRequest(key)}
        onTabChange={(_tabs: ArchbaseAdvancedTabItem[]) => {}}
        currentTabs={buildAdvancedTabs(openedTabs)}
        activeTab={activeTabId}
        dark={theme.colorScheme === 'dark'}
      ></ArchbaseAdvancedTabs>
    </div>
  );
}
