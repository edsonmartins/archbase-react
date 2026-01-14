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
  Image,
} from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { ColorSchemeControl, HeaderControls } from '@mantinex/mantine-header';
import { meta } from '@mantinex/mantine-meta';
import { Sidebar } from '../Sidebar/Sidebar';
import classes from './Shell.module.css';

interface ShellProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function Shell({ children, currentPath }: ShellProps) {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
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
        <div className={classes.inner}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <a
              href="/"
              className={cx('mantine-focus-auto', classes.logo)}
            >
              <Image
                src={colorScheme === 'dark'
                  ? "/images/logo_sem_texto_archbase_tema_dark.png"
                  : "/images/logo_sem_texto_archbase_tema_light.png"}
                alt="Archbase React"
                h={42}
                w="auto"
                fit="contain"
              />
              <Text className={classes.title} ml="xs">Archbase React</Text>
            </a>
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
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar currentPath={currentPath} onNavigate={() => toggle()} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="1400" px="md" className={classes.main}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
