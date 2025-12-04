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
import { initReactI18next } from 'react-i18next';
import '../locales/config';
import { archbaseTranslationResources } from '../locales/config';

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

// Função para inicialização precoce do i18next (chamada no main.tsx da aplicação)
export const initArchbaseI18nEarly = (translationName: string | string[], translationResource: any): void => {
	const namespaces = Array.isArray(translationName) ? ['archbase', ...translationName] : ['archbase', translationName].filter(Boolean);

	// Inicialização síncrona no main.tsx
	i18next
		.use(initReactI18next)
		.use(LanguageDetector)
		.init({
			debug: false,
			resources: buildResources(archbaseTranslationResources, translationName, translationResource),
			keySeparator: '.',
			ns: namespaces,
			defaultNS: Array.isArray(translationName) ? translationName[0] : translationName,
			fallbackLng: 'pt-BR',
			detection: {
				order: ['localStorage', 'navigator'],
				caches: ['localStorage'],
			},
			react: {
				useSuspense: false
			}
		});

	// Configurar listeners de mudança de idioma
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
};

export const initArchbaseTranslation = (translationName, translationResource): Promise<any> => {
	const namespaces = Array.isArray(translationName) ? ['archbase', ...translationName] : ['archbase', translationName].filter(Boolean);

	// Se já está inicializado, retorna uma promise resolvida
	if (i18next.isInitialized) {
		return Promise.resolve(i18next);
	}

	// Cria a promise de inicialização
	return i18next
		.use(initReactI18next)
		.use(LanguageDetector)
		.init({
			debug: false,
			resources: buildResources(archbaseTranslationResources, translationName, translationResource),
			keySeparator: '.',
			ns: namespaces,
			defaultNS: Array.isArray(translationName) ? translationName[0] : translationName,
			fallbackLng: 'pt-BR',
			detection: {
				order: ['localStorage', 'navigator'],
				caches: ['localStorage'],
			},
			react: {
				useSuspense: false
			}
		})
		.then(() => {
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
		});
};

// Função para obter a instância global do i18next
export const getI18nextInstance = () => i18next;

// Variável que aponta para a instância global do i18next
export const archbaseI18next = i18next;

// Hook personalizado que sempre usa a instância global do i18next
export const useArchbaseTranslation = (namespace?: string) => {
	const i18nextInstance = getI18nextInstance();

	const t = (key: string, options?: any) => {
		if (!i18nextInstance.isInitialized) {
			return key;
		}

		// Se um namespace foi especificado, usar ele
		if (namespace) {
			const namespacedKey = key.includes(':') ? key : `${namespace}:${key}`;
			return i18nextInstance.t(namespacedKey, options);
		}

		// Senão, usar a chave como está (pode ter namespace ou usar o default)
		return i18nextInstance.t(key, options);
	};

	return {
		t,
		i18n: i18nextInstance,
		ready: i18nextInstance.isInitialized
	};
};

// Função síncrona para tradução segura (baseada no artigo da Locize)
export const syncSafeTranslate = (key: string): string => {
	try {
		// Verifica se está inicializado e tem recursos
		if (i18next.isInitialized && typeof i18next.t === 'function') {
			const translation = t(key);
			// Se a tradução retornar a própria chave, usa fallback
			if (translation === key) {
				return key.split(':')[1] || key;
			}
			return translation;
		}

		// Fallback se não estiver inicializado
		return key.split(':')[1] || key;
	} catch (error) {
		return key.split(':')[1] || key;
	}
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
	const [language, setLanguage] = useState(i18next.language);
	// Inicialização síncrona: se i18next já está pronto, não precisamos aguardar
	const [isI18nInitialized, setIsI18nInitialized] = useState(i18next.isInitialized);
	
	useLayoutEffect(() => {
		const initI18n = async () => {
			// Se o i18next já foi inicializado no main.tsx, só configura o state se necessário
			if (i18next.isInitialized) {
				setLanguage(i18next.language);
				if (!isI18nInitialized) {
					setIsI18nInitialized(true);
				}
				return;
			}

			// Se não foi inicializado no main.tsx, inicializa aqui (fallback)
			if (translationName && translationResource) {
				try {
					await initArchbaseTranslation(translationName, translationResource);

					// Verificar se i18next está realmente pronto
					if (i18next.isInitialized && typeof i18next.t === 'function') {
						setLanguage(i18next.language);
						setIsI18nInitialized(true);
					} else {
						setIsI18nInitialized(true);
					}
				} catch (error) {
					setIsI18nInitialized(true);
				}
			} else {
				// Se não há configuração de tradução, considera inicializado
				setIsI18nInitialized(true);
			}
		};

		initI18n();

		const handleLanguageChange = (lng: string) => {
			setLanguage(lng);
		};
		i18next.on('languageChanged', handleLanguageChange);

		return () => {
			i18next.off('languageChanged', handleLanguageChange);
		};
	}, [translationName, translationResource]);

	// Aguarda a inicialização do i18next antes de renderizar os componentes
	if (!isI18nInitialized) {
		return <div>Loading translations...</div>;
	}

	return (
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
	);
}

export { ArchbaseGlobalProvider };
export type { ArchbaseThemeOverride };
