import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import i18next from 'i18next';
import { BRFlag, ESFlag, USFlag } from 'mantine-flagpack';
import React, { ReactNode, useEffect, useState } from 'react';
import { useArchbaseAppContext } from '../core';
import { useLocalStorage } from '@mantine/hooks';

export const ArchbaseChangeLanguageAction = () => {
	const context = useArchbaseAppContext();
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';
  const [currentLanguage, setCurrentLanguage] = useLocalStorage({
    key: 'i18nextLng',
    defaultValue: i18next.language || 'pt-BR',
  });

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
		if (language === 'en') {
			return <USFlag size={24} />;
		} else if (language === 'pt-BR') {
			return <BRFlag size={24} />;
		} else if (language === 'es') {
			return <ESFlag size={24} />;
		}
		return <BRFlag size={24} />;
	};

	const buildMenuItemLanguages = () => {
		if (context.languages) {
			return context.languages.map((language) => {
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
		setCurrentLanguage(language)
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
