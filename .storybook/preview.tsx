import { useDarkMode } from 'storybook-dark-mode';
import { ColorScheme, useMantineTheme } from '@mantine/core';
import { ArchbaseDark } from './archbase-dark.theme';
import { ArchbaseLight } from './archbase-ligth.theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import React, { useEffect } from 'react';
import '../locales/config';
import { demoContainerIOC } from '../src/demo/index';
import { ArchbaseAppProvider, ArchbaseGlobalProvider } from '../src/components/core';
import '../src/styles/advancedtabs.scss';
import '../src/styles/querybuilder.scss';
import '../src/styles/template.scss';
import '../src/styles/treeviews.scss';


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
      <ArchbaseAppProvider user={null} owner={null} selectedCompany={undefined}>
        {props.children}
      </ArchbaseAppProvider>
    </ArchbaseGlobalProvider>
  );
}

export const decorators = [(renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>];
