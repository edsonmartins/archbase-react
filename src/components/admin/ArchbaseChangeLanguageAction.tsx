import React, { ReactNode } from 'react';
import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars, IconLanguage } from '@tabler/icons-react';
import i18next from 'i18next';
import { useArchbaseAppContext } from '../core';
import { useTranslation } from 'react-i18next';
import { ESFlag, USFlag, BRFlag } from 'mantine-flagpack';

export const ArchbaseChangeLanguageAction = () => {
  const context = useArchbaseAppContext();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { i18n } = useTranslation();
  const dark = colorScheme === 'dark';

  const getIconByLanguage = (language: string): ReactNode => {
    if (language === 'en') {
      return <USFlag w={24} />;
    } else if (language === 'pt-BR') {
      return <BRFlag w={24} />;
    } else if (language === 'es') {
      return <ESFlag w={24} />;
    }

    return <BRFlag w={24} />;
  };

  const buildMenuItemLanguages = () => {
    if (context.languages) {
      return context.languages.map((language, index) => {
        return (
          <Menu.Item
            onClick={() => handleChangeLanguage(language.lang)}
            icon={getIconByLanguage(language.lang)}
            key={index}
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
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="transparent" color={dark ? 'white' : 'blue'} title={i18next.t('toggleLanguage')}>
          {getIconByLanguage(i18n.language)}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>{buildMenuItemLanguages()}</Menu.Dropdown>
    </Menu>
  );
};
