import { MantineTheme, MantineThemeOverride, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Container } from 'inversify';
import queryString from 'query-string';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ArchbaseNavigationProvider } from '../../admin';
import { ArchbaseUser } from '../../auth';
import '../../locales/config';
import { CustomShowErrorModal } from '../../notification';

export type ArchbaseLanguage = {
	lang: string;
	name: string;
};

interface ArchbaseAppContextValues {
	user: ArchbaseUser | null;
	owner: string | null;
	selectedCompany: any | null;
	theme: MantineTheme | null;
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
	iocContainer: null,
	dateFormat: 'dd/MM/yyyy',
	dateTimeFormat: 'dd/MM/yyyy HH:mm:ss',
	timeFormat: 'HH:mm:ss',
	variant: 'filled',
	setCustomTheme: undefined,
});

interface ArchbaseAppProviderProps {
	children?: ReactNode | ReactNode[];
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
		{ lang: 'en', name: 'Inglês' },
		{ lang: 'pt-BR', name: 'Português' },
		{ lang: 'es', name: 'Espanhol' },
	],
	setCustomTheme,
}) => {
	const theme = useMantineTheme();
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	const [colorSchemeLocalStorage, setColorSchemeLocalStorage] = useLocalStorage<'dark' | 'light'>({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});

	useEffect(() => {
		setColorScheme(colorSchemeLocalStorage);
	}, [colorSchemeLocalStorage, setColorScheme]);

	return (
		<ArchbaseAppContext.Provider
			value={{
				user,
				owner,
				selectedCompany,
				theme,
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
						<Router>
							<QueryParamProvider
								adapter={ReactRouter6Adapter}
								options={{
									searchStringToObject: queryString.parse,
									objectToSearchString: queryString.stringify,
								}}
							>
								{children}
							</QueryParamProvider>
						</Router>
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
