import { localStorageColorSchemeManager, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { enUS, es, ptBR } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import dayjs from 'dayjs';
import i18next, { i18n, ResourceLanguage } from 'i18next';
import { Resource, t } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Provider as IOCProvider } from 'inversify-react';
import React, { Suspense, useLayoutEffect, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
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
	translationName?: string | string[];
	translationResource?: ArchbaseTranslationResource;
	notificationPosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

const buildResources = (resource, translationName, translationResource) => {
	const result = { ...resource };

	if (translationResource) {
		const names = Array.isArray(translationName) ? translationName : [translationName || 'app'];

		Object.keys(translationResource).forEach((language) => {
			if (!result[language]) {
				result[language] = {};
			}

			names.forEach((name) => {
				// Verificar se estamos lidando com uma única namespace ou múltiplas
				if (Array.isArray(translationName)) {
					// Caso seja múltiplos namespaces, esperamos que translationResource[language][name] exista
					if (translationResource[language][name]) {
						result[language][name] = {
							...result[language][name],
							...translationResource[language][name],
						};
					}
				} else {
					// Caso seja uma única namespace, adicionamos diretamente a translationResource
					result[language][name] = {
						...result[language][name],
						...translationResource[language],
					};
				}
			});
		});
	}

	return result;
};

export const initArchbaseTranslation = (translationName, translationResource): any => {
	const namespaces = Array.isArray(translationName) ? ['archbase', ...translationName] : ['archbase', translationName].filter(Boolean);

	i18next
		.use(initReactI18next)
		.use(LanguageDetector)
		.init({
			debug: false,
			resources: buildResources(archbaseTranslationResources, translationName, translationResource),
			keySeparator: '.',
			ns: namespaces,
			defaultNS: 'archbase',
			fallbackLng: 'pt-BR', // Define um idioma padrão caso o idioma detectado não seja suportado
      detection: {
        order: ['localStorage', 'navigator'], // Tenta detectar o idioma no localStorage primeiro, depois o do navegador
        caches: ['localStorage'], // Cache o idioma detectado no localStorage
      },
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
	key: 'mantine-color-scheme',
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
	const [language, setLanguage] = useState(i18next.language || 'pt-BR');
	useLayoutEffect(() => {
		setLanguage(initArchbaseTranslation(translationName, translationResource).language);
		const handleLanguageChange = (lng: string) => {
			setLanguage(lng);
		};
		i18next.on('languageChanged', handleLanguageChange);

		return () => {
			i18next.off('languageChanged', handleLanguageChange);
		};
	}, [translationName, translationResource]);

	return (
		<I18nextProvider i18n={i18next} defaultNS={translationName}>
			<IOCProvider container={containerIOC}>
				<DatesProvider settings={{ locale: language }}>
					<MantineProvider
						theme={colorScheme === 'dark' ? themeDark : themeLight}
						withCssVariables={withCssVariables}
						colorSchemeManager={colorSchemeManager}
					>
						<Notifications autoClose={notificationAutoClose} position={notificationPosition} />
						<Suspense>{children}</Suspense>
					</MantineProvider>
				</DatesProvider>
			</IOCProvider>
		</I18nextProvider>
	);
}

export { ArchbaseGlobalProvider };
export type { ArchbaseThemeOverride };
