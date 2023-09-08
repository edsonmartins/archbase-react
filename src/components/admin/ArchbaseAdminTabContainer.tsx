import React, { ReactNode, useContext, useEffect, useRef, useState, useTransition } from 'react'
import useComponentSize from '@rehooks/component-size'
import { useLocation, useNavigate } from 'react-router'
import { useMantineTheme } from '@mantine/core'
import { ArchbaseAdvancedTabItem, ArchbaseAdvancedTabs } from '../containers/tabs'
import { ArchbaseNavigationItem, ArchbaseTabItem } from './types'
import {
  ArchbaseAdminLayoutContext,
  ArchbaseAdminLayoutContextValue
} from './ArchbaseAdminLayout.context'
import { matchPath } from 'react-router'
import i18next from 'i18next'

export interface ArchbaseAdminTabContainerProps {
  navigationData: ArchbaseNavigationItem[]
  onChangeActiveTabId?: (activeTabId: any)=>void
  onChangeOpenedTabs?: (openedTabs : ArchbaseTabItem[])=>void
  activeTabId?: any;
  openedTabs? : ArchbaseTabItem[]
}

interface ResultItem {
  item: ArchbaseNavigationItem | undefined;
  title: string | undefined;
  link: string;
}

export function ArchbaseAdminTabContainer({ navigationData, onChangeOpenedTabs, onChangeActiveTabId, activeTabId:defaultActiveTabId, openedTabs:defaultOpenedTabs = [] }: ArchbaseAdminTabContainerProps) {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const [openedTabs, setOpenedTabs] = useState<ArchbaseTabItem[]>(defaultOpenedTabs)
  const [activeTabId, setActiveTabId] = useState<any>(defaultActiveTabId)
  const currentLocation = useLocation()
  const tabsRef = useRef<any>([])
  const size = useComponentSize(tabsRef)
  const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(
    ArchbaseAdminLayoutContext
  )

  const getNavigationItemByLink = (link: string): ResultItem => {
    let result: ResultItem = {item: undefined, title: undefined, link}
    navigationData.forEach((item) => {
      if (item.links) {
        item.links.forEach((subItem) => {
          const found = matchPath({ path: subItem.link||'' }, location.pathname)
          if (found) {
            result.item = subItem;
            result.title = `${i18next.t(subItem.label)}`;
          }
        })
      } else if (item.link) {
        const found = matchPath({ path: item.link }, location.pathname)
        if (found) {
          if (found.params) {
            result.title = `${found.params[Object.keys(found.params)[0]]}`
          } else {
            result.title = `${i18next.t(item.label)}`;
          }
          result.item = item;
        }
      }
    })
    return result
  }

  useEffect(() => {
    const resultItem: ResultItem = getNavigationItemByLink(
      currentLocation.pathname
    )
    if (resultItem && resultItem.item) {
      const index = openedTabs.findIndex((tab) => tab.path === resultItem.link)
      if (index !== -1) {
        startTransition(() => {
          openedTabs[index].title = resultItem.title!;
          setActiveTabId(openedTabs[index].id);
          onChangeActiveTabId && onChangeActiveTabId(openedTabs[index].id)
        });
      } else {
          setOpenedTabs((prevTabs)=>{
            prevTabs.push({
              id: `${resultItem.link}`,
              title: `${resultItem.title}`,
              path: `${resultItem.link}`,
              active: true,
              content: resultItem.item!.component,
              iconClass: resultItem.item!.icon,
              closeButton: true
            })
            onChangeOpenedTabs && onChangeOpenedTabs(openedTabs)
            setActiveTabId(`${resultItem.link}`)
            return prevTabs;
          })          
      }
    }
  }, [currentLocation.pathname])

  const handleOnActive = (id: string) => {
    const items = openedTabs.filter((item) => item.id === id)
    if (items && items.length > 0) {
      if (currentLocation.pathname !== items[0].path) {
        navigate(items[0].path)
      }
    }
    startTransition(() => {
      setActiveTabId(id)
      onChangeActiveTabId && onChangeActiveTabId(id)
    });
  }

  const handleOnClose = (id: string) => {
    const tmpTabs = openedTabs.filter((f) => f.id !== id)
    let idx = -1
    tmpTabs.forEach((f, index) => f.id === activeTabId && (idx = index))
    let tmpCurrent : string|null = null;
    if (tmpTabs.length > 0 && tmpTabs[idx] ){
      tmpCurrent = tmpTabs[idx].id ;
    } else if (tmpTabs.length > 0) {
      tmpCurrent = tmpTabs[tmpTabs.length-1].id ;
    } else {
      tmpCurrent = null;
    }
    startTransition(() => {
      const nextTabs = tmpTabs.map((tab) => ({ ...tab, active: tmpCurrent === tab.id }));
      setOpenedTabs(nextTabs)
      onChangeOpenedTabs && onChangeOpenedTabs(nextTabs)
      if (tmpCurrent && tmpCurrent != null) {
        setActiveTabId(tmpCurrent)
        onChangeActiveTabId && onChangeActiveTabId(tmpCurrent)
        openedTabs.forEach((f, index) => f.id === tmpCurrent && (idx = index))
        if (idx !== -1) {
          navigate(tmpTabs[idx].path)
        }
      } else {
        setActiveTabId(undefined)
        onChangeActiveTabId && onChangeActiveTabId(undefined)
        navigate(adminLayoutContextValue.navigationRootLink!)
      }
    });
  }

  const buildAdvancedTabs = (openedTabs: ArchbaseTabItem[]): ArchbaseAdvancedTabItem[] => {
    return openedTabs.map((tab) => {
      const result: ArchbaseAdvancedTabItem = { key: tab.id, favicon: tab.iconClass, title: tab.title }
      return result
    })
  }

  console.log(openedTabs)

  return (
    <div ref={tabsRef}>
      <ArchbaseAdvancedTabs
        onClick={(key: any) => handleOnActive(key)}
        onTabClose={(key: any) => handleOnClose(key)}
        onTabChange={(_tabs: ArchbaseAdvancedTabItem[]) => {}}
        currentTabs={buildAdvancedTabs(openedTabs)}
        activeTab={activeTabId}
        dark={theme.colorScheme === 'dark'}
      ></ArchbaseAdvancedTabs>
    </div>
  )
}
