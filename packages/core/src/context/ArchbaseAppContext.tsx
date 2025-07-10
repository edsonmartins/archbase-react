import React, { createContext, ReactNode, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Container } from 'inversify';
import {
  MantineTheme,
  MantineColorScheme,
  MantineThemeOverride,
  useMantineTheme,
  useMantineColorScheme
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useLocalStorage } from '@mantine/hooks';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ProSidebarProvider } from 'react-pro-sidebar';
import queryString from 'query-string';
import { ArchbaseUser } from '../types';

// Mock components for missing dependencies
const CustomShowErrorModal = (props: any) => <div>{props.innerProps?.children}</div>;
const ArchbaseNavigationProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

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

const ArchbaseAppContext = createContext<ArchbaseAppContextValues>({
	user: null,
	owner: null,
	selectedCompany: null,
	theme: null,
	colorScheme: null,
	iocContainer: null,
	dateFormat: 'dd/MM/yyyy',
	dateTimeFormat: 'dd/MM/yyyy HH:mm:ss',
	timeFormat: 'HH:mm:ss',
	variant: 'filled',
	setCustomTheme: undefined,
});

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

const ArchbaseAppProvider: React.FC<ArchbaseAppProviderProps> = ({
	user,
	owner,
	selectedCompany,
	children,
	iocContainer,
	dateFormat = 'dd/MM/yyyy',
	dateTimeFormat = 'dd/MM/yyyy HH:mm:ss',
	timeFormat = 'HH:mm:ss',
	variant = 'filled',
	languages = [
		{ lang: 'en', name: 'English' },
		{ lang: 'pt-BR', name: 'Português' },
		{ lang: 'es', name: 'Español' },
	],
	setCustomTheme,
}) => {
	const theme = useMantineTheme();
	const currentColorScheme = useRef('');
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	const [colorSchemeLocalStorage, setColorSchemeLocalStorage] = useLocalStorage<'dark' | 'light'>({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: false,
	});

	useEffect(() => {
		if (currentColorScheme.current !== colorSchemeLocalStorage) {
			setColorScheme(colorSchemeLocalStorage);
			currentColorScheme.current = colorSchemeLocalStorage;
		}
	}, [colorSchemeLocalStorage, setColorScheme]);

	return (
		<ArchbaseAppContext.Provider
			value={{
				user,
				owner,
				selectedCompany,
				theme,
				colorScheme,
				iocContainer,
				dateFormat,
				dateTimeFormat,
				timeFormat,
				variant,
				languages,
				setCustomTheme,
			}}
		>
			<ModalsProvider
				modals={{ archbaseShowError: CustomShowErrorModal }}
				modalProps={{
					size: 'lg',
					overlayProps: {
						color: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],
						opacity: 0.25,
					},
				}}
			>
				<ProSidebarProvider>
					<ArchbaseNavigationProvider>
						<BrowserRouter>
							<QueryParamProvider
								adapter={ReactRouter6Adapter}
								options={{
									searchStringToObject: queryString.parse,
									objectToSearchString: queryString.stringify,
								}}
							>
								{children as any}
							</QueryParamProvider>
						</BrowserRouter>
					</ArchbaseNavigationProvider>
				</ProSidebarProvider>
			</ModalsProvider>
		</ArchbaseAppContext.Provider>
	);
};

const useArchbaseAppContext = () => {
	const context = useContext(ArchbaseAppContext);
	if (!context) {
		throw new Error('useArchbaseAppContext deve ser usado dentro de um ArchbaseAppProvider');
	}
	return context;
};

export { ArchbaseAppContext, ArchbaseAppProvider, useArchbaseAppContext };
export type { ArchbaseAppContextValues };
