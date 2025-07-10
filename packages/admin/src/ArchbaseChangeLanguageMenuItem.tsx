import { ActionIcon, Button, Group, Menu, Space, useMantineColorScheme } from '@mantine/core';
import i18next from 'i18next';
import { BRFlag, ESFlag, USFlag } from 'mantine-flagpack';
import React, { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useArchbaseAppContext } from '@archbase/core';

export const ArchbaseChangeLanguageMenuItem = () => {
	const context = useArchbaseAppContext();
	const { colorScheme } = useMantineColorScheme();
	const { i18n } = useTranslation();
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
		i18n.changeLanguage(language);
	};

	return (
		<Menu>
			<Menu.Target>

				<Group w={"100%"} justify='flex-start'
					p={'calc(var(--mantine-spacing-xs) / 1.5) var(--mantine-spacing-xs)'}
					c={'var(--mantine-text-color)'}
					variant="transparent"
					fw={400}
					gap={4}
					title={i18next.t('archbase:toggleLanguage')}>
					{getIconByLanguage(i18n.language)}
					{`${context.languages.find(language => language.lang === i18n.language)?.name ?? "Português"}`}
				</Group>
			</Menu.Target>

			<Menu.Dropdown>{buildMenuItemLanguages()}</Menu.Dropdown>
		</Menu>
	);
};
