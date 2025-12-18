'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavLink, ScrollArea, Text } from '@mantine/core';
import { NAVIGATION_DATA, NavItem } from '@/data/navigation';
import classes from './Sidebar.module.css';

interface SidebarProps {
  currentPath?: string;
  onNavigate?: () => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const router = useRouter();
  const activePath = currentPath || router.pathname;

  const isActive = (href: string) => activePath === href;

  const isChildActive = (item: NavItem): boolean => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => isChildActive(child));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, depth = 0): React.ReactNode => {
    if (item.children) {
      return (
        <NavLink
          key={item.label}
          label={item.label}
          defaultOpened={isChildActive(item)}
          className={classes.navLink}
          childrenOffset={depth === 0 ? 16 : 12}
        >
          {item.children.map((child) => renderNavItem(child, depth + 1))}
        </NavLink>
      );
    }

    return (
      <NavLink
        key={item.href}
        component={Link}
        href={item.href!}
        label={item.label}
        active={isActive(item.href!)}
        className={classes.navLink}
        onClick={onNavigate}
      />
    );
  };

  return (
    <ScrollArea className={classes.sidebar} offsetScrollbars>
      {NAVIGATION_DATA.map((item) => renderNavItem(item))}
    </ScrollArea>
  );
}
