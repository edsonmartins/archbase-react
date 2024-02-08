import { localStorageColorSchemeManager, MantineProvider, MantineThemeOverride } from '@mantine/core';
import '@mantine/core/styles.css';
import { DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import { enUS, es, ptBR } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import dayjs from 'dayjs';
import i18next, { i18n, ResourceLanguage } from 'i18next';
import { Resource, t } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as IOCProvider } from 'inversify-react';
import React, { useLayoutEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import '../../locales/config';
import { archbaseTranslationResources } from '../../locales/config';

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
	translationName?: string;
	translationResource?: ArchbaseTranslationResource;
	notificationPosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

const buildResources = (
	resource: Resource,
	translationName?: string,
	translationResource?: ArchbaseTranslationResource,
): Resource | undefined => {
	const result = resource;
	if (translationResource) {
		const name = translationName ? translationName : 'app';
		Object.keys(translationResource).forEach((language) => {
			if (!resource[language]) {
				resource[language] = { [name]: translationResource[language] };
			}
			if (!resource[language][name]) {
				resource[language][name] = translationResource[language];
			}
		});
		return result;
	}
};

export const initArchbaseTranslation = (translationName, translationResource): any => {
	i18next
		.use(initReactI18next)
		.use(LanguageDetector)
		.init({
			debug: false,
			resources: buildResources(archbaseTranslationResources, translationName, translationResource),
			keySeparator: '.',
			ns: translationName ? ['archbase', translationName] : ['archbase'],
			defaultNS: 'archbase',
		});

	i18next.on('languageChanged', (lng: string) => {
		if (lng === 'en') {
			setDefaultOptions({ locale: enUS });
			dayjs.locale('en');
		} else if (lng === 'es') {
			setDefaultOptions({ locale: es });
			dayjs.locale('es');
		} else if (lng === 'pt-BR') {
			setDefaultOptions({ locale: ptBR });
			dayjs.locale('pt-BR');
		}
	});
	return i18next;
};

const colorSchemeManager = localStorageColorSchemeManager({
	key: 'my-color-scheme',
});

function ArchbaseGlobalProvider({
	children,
	colorScheme = 'light',
	containerIOC,
	themeDark,
	themeLight,
	withCssVariables,
	notificationAutoClose = 5000,
	notificationPosition = 'top-right',
	translationName,
	translationResource,
}: ArchbaseAppProviderProps) {
	const [language, setLanguage] = useState('pt-BR');
	useLayoutEffect(() => {
		setLanguage(initArchbaseTranslation(translationName, translationResource).language);
	}, []);

	return (
		<IOCProvider container={containerIOC}>
			<DatesProvider settings={{ locale: language }}>
				<MantineProvider
					theme={colorScheme === 'dark' ? themeDark : themeLight}
					withCssVariables={withCssVariables}
					colorSchemeManager={colorSchemeManager}
				>
					<Notifications autoClose={notificationAutoClose} position={notificationPosition} />
					{children}
				</MantineProvider>
			</DatesProvider>
		</IOCProvider>
	);
}

export { ArchbaseGlobalProvider };
export type { ArchbaseThemeOverride };
