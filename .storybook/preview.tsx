import "reflect-metadata";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import 'mantine-react-table/styles.css';
import { useDarkMode } from 'storybook-dark-mode';
import { Preview } from '@storybook/react';
import { MantineThemeOverride } from '@mantine/core';
import { ArchbaseDark } from './archbase-dark.theme';
import { ArchbaseLight } from './archbase-ligth.theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import React, { useEffect, useState } from 'react';
import '../src/components/locales/config';
import { demoContainerIOC } from '../src/demo/index';
import { ArchbaseAppProvider, ArchbaseGlobalProvider } from '../src/components/core';
import translation_en from '../src/demo/locales/en/translation.json';
import translation_ptbr from '../src/demo/locales/pt-BR/translation.json';
import translation_es from '../src/demo/locales/es/translation.json';
import '../src/styles/advancedtabs.scss';
import '../src/styles/querybuilder.scss';
import '../src/styles/template.scss';
import '../src/styles/treeviews.scss';
import '../src/styles/errorboundary.scss';
import '../src/styles/utils.scss';
import '../src/styles/spaces.css';
import '../.storybook/archbase-global.css'


const channel = addons.getChannel();

function ThemeWrapper(props: { children: React.ReactNode }) {
  const [dark, setThemeDark] = useState<MantineThemeOverride>(ArchbaseDark)
  const [light, setThemeLight] = useState<MantineThemeOverride>(ArchbaseLight)
  const colorSchem = useDarkMode() ? 'dark' : 'light';
  const [colorScheme, setColorScheme] = useLocalStorage<'dark' | 'light'>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });  

  const handleColorScheme = (value: boolean) => {
    setColorScheme(value ? 'dark' : 'light')
  };

  const handleChangeCustomTheme = (dark: MantineThemeOverride, light: MantineThemeOverride) => {
      setThemeDark(dark)
      setThemeLight(light)
  }

  const toggleColorScheme = (value?: 'dark' | 'light') =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return (
    <ArchbaseGlobalProvider
      colorScheme={colorSchem}
      containerIOC={demoContainerIOC}
      themeDark={dark}
      themeLight={light}
      translationName="demo"
      translationResource={{ en: translation_en, 'pt-BR': translation_ptbr, es: translation_es }}
    >
      <ArchbaseAppProvider user={null} owner={null} selectedCompany={undefined} setCustomTheme={handleChangeCustomTheme}>
        {props.children}
      </ArchbaseAppProvider>
    </ArchbaseGlobalProvider>
  );
}


const preview: Preview = {
  decorators : [(renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>],
  parameters : {
    options: {
      storySort: {
        order: ['Introdução','Temas e cores','Admin','Autenticação','Fontes de dados','Filtros','Layouts','Modelos','Serviços','*'],
        locales: '',
      },
    },
  }
}

export default preview;
