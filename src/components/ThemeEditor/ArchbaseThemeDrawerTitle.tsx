import React from 'react';
import { Switch, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export function ArchbaseThemeDrawerTitle() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleClick = () => {
    toggleColorScheme();
    console.log(colorScheme);
  };

  const dark = colorScheme === 'dark';

  return (
    <>
      <Switch
        size="md"
        color={dark ? 'gray' : 'dark'}
        thumbIcon={
          dark ? (
            <IconMoonStars size="1rem" stroke={2.5} color={theme.colors.blue[6]} />
          ) : (
            <IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />
          )
        }
        onClick={handleClick}
      />
    </>
  );
}
