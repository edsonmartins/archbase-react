import "reflect-metadata";
import { useDarkMode } from 'storybook-dark-mode';
import { Preview } from '@storybook/react';
import { ColorScheme, useMantineTheme } from '@mantine/core';
import { ArchbaseDark } from './archbase-dark.theme';
import { ArchbaseLight } from './archbase-ligth.theme';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import React, { useEffect } from 'react';
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


const channel = addons.getChannel();

function ThemeWrapper(props: { children: React.ReactNode }) {
  const colorSchem = useDarkMode() ? 'dark' : 'light';
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });  

  const handleColorScheme = (value: boolean) => setColorScheme(value ? 'dark' : 'light');


  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

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
      translationName="demo"
      translationResource={{ en: translation_en, 'pt-BR': translation_ptbr, es: translation_es }}
    >
      <ArchbaseAppProvider user={null} owner={null} selectedCompany={undefined}>
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
