import { Switch, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import React from 'react';

interface ArchbaseThemeDrawerTitleProps {
  toggleDarkMode: () => void;
}

export function ArchbaseThemeDrawerTitle({ toggleDarkMode }: ArchbaseThemeDrawerTitleProps) {
  const theme = useMantineTheme();

  const { colorScheme } = useMantineColorScheme();

  const dark = colorScheme === 'dark';

  return (
    <>
      <Switch
        size="md"
        color={!dark ? theme.white : theme.black}
        thumbIcon={
          !dark ? (
            <IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />
          ) : (
            <IconMoonStars size="1rem" stroke={2.5} color={theme.colors.blue[6]} />
          )
        }
        onClick={toggleDarkMode}
      />
    </>
  );
}
