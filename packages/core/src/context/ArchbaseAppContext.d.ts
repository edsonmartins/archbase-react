import React, { ReactNode } from 'react';
import { Container } from 'inversify';
import { MantineTheme, MantineColorScheme, MantineThemeOverride } from '@mantine/core';
import { ArchbaseUser } from '../types';
export type ArchbaseLanguage = {
    lang: string;
    name: string;
};
interface ArchbaseAppContextValues {
    user: ArchbaseUser | null;
    owner: string | null;
    selectedCompany: any | null;
    theme: MantineTheme | null;
    colorScheme: MantineColorScheme | null;
    iocContainer: Container | null;
    dateFormat: string;
    dateTimeFormat: string;
    timeFormat: string;
    variant?: string;
    languages?: ArchbaseLanguage[];
    setCustomTheme?: (dark: MantineThemeOverride, light: MantineThemeOverride) => void;
}
declare const ArchbaseAppContext: React.Context<ArchbaseAppContextValues>;
interface ArchbaseAppProviderProps {
    children?: ReactNode;
    user: any | null;
    owner: string | null;
    selectedCompany: any | null;
    iocContainer?: any;
    dateFormat?: string;
    dateTimeFormat?: string;
    timeFormat?: string;
    variant?: string;
    languages?: ArchbaseLanguage[];
    setCustomTheme?: (dark: MantineThemeOverride, light: MantineThemeOverride) => void;
}
declare const ArchbaseAppProvider: React.FC<ArchbaseAppProviderProps>;
declare const useArchbaseAppContext: () => ArchbaseAppContextValues;
export { ArchbaseAppContext, ArchbaseAppProvider, useArchbaseAppContext };
export type { ArchbaseAppContextValues };
//# sourceMappingURL=ArchbaseAppContext.d.ts.map