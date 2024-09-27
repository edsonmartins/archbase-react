import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import i18next from 'i18next';
import { BRFlag, ESFlag, USFlag } from 'mantine-flagpack';
import React, { ReactNode } from 'react';
import { useArchbaseAppContext } from '../core';

export const ArchbaseChangeLanguageAction = () => {
	const context = useArchbaseAppContext();
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === 'dark';

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
	};

	return (
		<Menu shadow="md" width={200} position="bottom-end">
			<Menu.Target>
				<ActionIcon variant="transparent" color={dark ? 'white' : 'blue'} title={i18next.t('toggleLanguage')}>
					{getIconByLanguage(i18next.language)}
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>{buildMenuItemLanguages()}</Menu.Dropdown>
		</Menu>
	);
};
