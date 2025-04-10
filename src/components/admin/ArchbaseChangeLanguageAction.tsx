import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import i18next from 'i18next';
import { ARFlag, BOFlag, BRFlag, CLFlag, COFlag, CRFlag, CUFlag, DOFlag, ECFlag, ESFlag, GTFlag, HNFlag, MXFlag, NIFlag, PAFlag, PEFlag, PYFlag, SVFlag, USFlag, UYFlag, VEFlag } from 'mantine-flagpack';
import React, { ReactNode, useEffect, useState } from 'react';
import { useArchbaseAppContext } from '../core';

export const ArchbaseChangeLanguageAction = () => {
	const context = useArchbaseAppContext();
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';
	const [currentLanguage, setCurrentLanguage] = useState(i18next.language);

	useEffect(() => {
		const handleLanguageChange = (lng: string) => {
			setCurrentLanguage(lng);
		};

		i18next.on('languageChanged', handleLanguageChange);

		// Cleanup listener on unmount
		return () => {
			i18next.off('languageChanged', handleLanguageChange);
		};
	}, []);

	const getIconByLanguage = (language: string): ReactNode => {
		if (!language) {
			return <BRFlag size={24} />;
		}
		if (language === 'en' || language === 'en-US') {
			return <USFlag size={24} />;
		} else if (language === 'pt-BR') {
			return <BRFlag size={24} />;
		} else if (language.includes('es')) {
			switch (navigator.language || navigator.languages[0]) {
				case 'es':
				case 'es-ES':
					return <ESFlag size={24} />;
				case 'es-AR':
					return <ARFlag size={24} />;
				case 'es-BO':
					return <BOFlag size={24} />;
				case 'es-CL':
					return <CLFlag size={24} />;
				case 'es-CO':
					return <COFlag size={24} />;
				case 'es-CR':
					return <CRFlag size={24} />;
				case 'es-CU':
					return <CUFlag size={24} />;
				case 'es-DO':
					return <DOFlag size={24} />;
				case 'es-EC':
					return <ECFlag size={24} />;
				case 'es-GT':
					return <GTFlag size={24} />;
				case 'es-HN':
					return <HNFlag size={24} />;
				case 'es-MX':
					return <MXFlag size={24} />;
				case 'es-NI':
					return <NIFlag size={24} />;
				case 'es-PA':
					return <PAFlag size={24} />;
				case 'es-PE':
					return <PEFlag size={24} />;
				case 'es-PY':
					return <PYFlag size={24} />;
				case 'es-SV':
					return <SVFlag size={24} />;
				case 'es-UY':
					return <UYFlag size={24} />;
				case 'es-VE':
					return <VEFlag size={24} />;
				default:
					return <ESFlag size={24} />;
			}
		}
		return <BRFlag size={24} />;
	};

	const buildMenuItemLanguages = () => {
		if (context.languages) {
			return context.languages.filter(language => language).map((language) => {
				return (
					<Menu.Item
						key={language.name}
						onClick={() => handleChangeLanguage(language.lang)}
						leftSection={getIconByLanguage(language.lang)}
					>
						{language.name}
					</Menu.Item>
				);
			});
		}
	};

	const handleChangeLanguage = (language: string) => {
		i18next.changeLanguage(language);
	};

	return (
		<Menu shadow="md" width={200} position="bottom-end">
			<Menu.Target>
				<ActionIcon variant="transparent" color={dark ? 'white' : 'blue'} title={i18next.t('toggleLanguage')}>
					{getIconByLanguage(currentLanguage)}
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>{buildMenuItemLanguages()}</Menu.Dropdown>
		</Menu>
	);
};
