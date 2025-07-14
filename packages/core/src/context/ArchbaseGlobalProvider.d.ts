import { MantineThemeOverride } from '@mantine/core';
import { ResourceLanguage } from 'i18next';
import React from 'react';
import '../locales/config';
type ArchbaseThemeOverride = MantineThemeOverride;
interface ArchbaseTranslationResource {
    [language: string]: ResourceLanguage;
}
interface ArchbaseAppProviderProps {
    children?: React.ReactNode;
    colorScheme: 'dark' | 'light';
    containerIOC: any | undefined;
    themeDark?: ArchbaseThemeOverride;
    themeLight?: ArchbaseThemeOverride;
    withCssVariables?: boolean;
    notificationAutoClose?: number;
    translationName?: string | string[];
    translationResource?: ArchbaseTranslationResource;
    notificationPosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}
export declare const initArchbaseTranslation: (translationName: any, translationResource: any) => any;
declare function ArchbaseGlobalProvider({ children, colorScheme, containerIOC, themeDark, themeLight, withCssVariables, notificationAutoClose, notificationPosition, translationName, translationResource, }: ArchbaseAppProviderProps): import("react/jsx-runtime").JSX.Element;
export { ArchbaseGlobalProvider };
export type { ArchbaseThemeOverride };
//# sourceMappingURL=ArchbaseGlobalProvider.d.ts.map