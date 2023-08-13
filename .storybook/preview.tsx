import { useDarkMode } from 'storybook-dark-mode';
import { MantineProvider, ColorSchemeProvider, ColorScheme, useMantineTheme } from '@mantine/core';
import { ArchbaseDark } from './archbase-dark.theme';
import { ArchbaseLight } from './archbase-ligth.theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { DatesProvider } from '@mantine/dates';
import '../locales/config';
import i18next from 'i18next';
import { Provider as IOCProvider } from 'inversify-react';
import { demoContainerIOC } from '../src/demo/index';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { ArchbaseScreenClassProvider } from '../src/components/containers/gridLayout';
import { ArchbaseAppContext, ArchbaseAppProvider, ArchbaseGlobalProvider } from '../src/components/core';


function ThemeWrapper(props: { children: React.ReactNode }) {
  const colorSchem = useDarkMode() ? 'dark' : 'light';
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });  

  useEffect(() => {
    setColorScheme(colorSchem);
    const body = window.document.body;
    body.style.backgroundColor = colorSchem==='dark'?'black':'white';
  }, [colorSchem]);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <ArchbaseGlobalProvider
      colorScheme={colorSchem}
      containerIOC={demoContainerIOC}
      themeDark={ArchbaseDark}
      themeLight={ArchbaseLight}
      toggleColorScheme={toggleColorScheme}
    >
      <ArchbaseAppProvider user={null} owner={null} selectedCompany={undefined} theme={theme}>
        {props.children}
      </ArchbaseAppProvider>
    </ArchbaseGlobalProvider>
  );
}

export const decorators = [(renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>];
