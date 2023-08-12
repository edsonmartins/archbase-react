import React from 'react';
import { Provider as IOCProvider } from 'inversify-react';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import {
  ColorScheme,
  ColorSchemeProvider,
  EmotionCache,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/styles';
import '../../../../locales/config';
import i18next from 'i18next';

interface ArchbaseThemeOverride extends MantineThemeOverride {
}

interface ArchbaseAppProviderProps {
  children?: React.ReactNode;
  colorScheme: 'dark' | 'light';
  containerIOC: any | undefined;
  themeDark?: ArchbaseThemeOverride;
  themeLight?: ArchbaseThemeOverride;
  emotionCache?: EmotionCache;
  withNormalizeCSS?: boolean;
  withGlobalStyles?: boolean;
  withCSSVariables?: boolean;
  toggleColorScheme: (colorScheme?: ColorScheme) => void;
  notificationAutoClose?: number;
  notificationPosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

const ArchbaseGlobalProvider: React.FC<ArchbaseAppProviderProps> = ({
  children,
  colorScheme='light',
  containerIOC,
  themeDark,
  themeLight,
  emotionCache,
  withCSSVariables,
  withGlobalStyles,
  withNormalizeCSS,
  notificationAutoClose=5000,
  notificationPosition="top-right",
  toggleColorScheme
}) => {
  return (
    <IOCProvider container={containerIOC}>
      <DatesProvider settings={{ locale: i18next.language }}>
        <MantineProvider
          theme={colorScheme === 'dark' ? themeDark : themeLight}
          emotionCache={emotionCache}
          withGlobalStyles={withGlobalStyles}
          withNormalizeCSS={withNormalizeCSS}
          withCSSVariables={withCSSVariables}
        >
          <ModalsProvider>
            <Notifications autoClose={notificationAutoClose} position={notificationPosition} />
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
              {children}
            </ColorSchemeProvider>
          </ModalsProvider>
        </MantineProvider>
      </DatesProvider>
    </IOCProvider>
  );
};

export { ArchbaseGlobalProvider };  
export type { ArchbaseThemeOverride };

