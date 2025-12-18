'use client';

import React from 'react';
import cx from 'clsx';
import {
  AppShell,
  Burger,
  Container,
  Group,
  RemoveScroll,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { ColorSchemeControl, HeaderControls } from '@mantinex/mantine-header';
import { MantineLogo } from '@mantinex/mantine-logo';
import { meta } from '@mantinex/mantine-meta';
import { Sidebar } from '../Sidebar/Sidebar';
import classes from './Shell.module.css';

interface ShellProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function Shell({ children, currentPath }: ShellProps) {
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, { toggle }] = useDisclosure();

  useHotkeys([['mod + J', toggleColorScheme]]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header className={cx(RemoveScroll.classNames.zeroRight, classes.header)}>
        <Container size="xl" px="md" className={classes.inner}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <a
              href="https://mantine.dev/"
              target="_blank"
              className={cx('mantine-focus-auto', classes.logo)}
              rel="noreferrer"
            >
              <MantineLogo size={30} type="mark" />
            </a>
            <Text className={classes.title}>Archbase React</Text>
          </Group>

          <HeaderControls
            visibleFrom="sm"
            githubLink="https://github.com/edsonmartins/archbase-react"
            withDirectionToggle={false}
            withSearch={false}
            withSupport={false}
            discordLink={meta.discordLink}
          />

          <Group hiddenFrom="sm">
            <ColorSchemeControl />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar currentPath={currentPath} onNavigate={() => toggle()} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="lg" px="md" className={classes.main}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
