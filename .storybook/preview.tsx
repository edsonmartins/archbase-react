import { useDarkMode } from 'storybook-dark-mode';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { ArchbaseDark } from './archbase-dark.theme';
import { ArchbaseLight } from './archbase-ligth.theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { DatesProvider } from '@mantine/dates';
import '../locales/config';
import i18next from 'i18next';
import { Provider as IOCProvider } from 'inversify-react';
import { demoContainerIOC } from '../src/demo/index';

function ThemeWrapper(props: { children: React.ReactNode }) {
  const colorSchem = useDarkMode() ? 'dark' : 'light';
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    setColorScheme(colorSchem);
  }, [colorSchem]);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <IOCProvider container={demoContainerIOC}>
      <DatesProvider settings={{ locale: i18next.language }}>
        <MantineProvider
          theme={colorScheme === 'dark' ? ArchbaseDark : ArchbaseLight}
          withGlobalStyles
          withNormalizeCSS
        >
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            {props.children}
          </ColorSchemeProvider>
        </MantineProvider>
      </DatesProvider>
    </IOCProvider>
  );
}

export const decorators = [(renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>];
