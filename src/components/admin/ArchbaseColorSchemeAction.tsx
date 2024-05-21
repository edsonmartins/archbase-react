import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import i18next from 'i18next';
import React from 'react';

export interface ArchbaseColorSchemeActionProps {
	toggleColorScheme?: () => void;
	sunColor?: string;
	moonColor?: string;
}

export const ArchbaseColorSchemeAction = ({
	toggleColorScheme: toggleColorSchemeExternal,
	sunColor = 'white',
	moonColor = 'blue',
}: ArchbaseColorSchemeActionProps) => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	const handleToggle = () => {
		if (toggleColorSchemeExternal) {
			toggleColorSchemeExternal();
		} else {
			toggleColorScheme();
		}
	};
	const dark = colorScheme === 'dark';
	return (
		<ActionIcon
			variant="transparent"
			color={dark ? sunColor : moonColor}
			onClick={() => handleToggle()}
			title={i18next.t('toggleColorScheme')}
		>
			{dark ? <IconSun size="1.5rem" /> : <IconMoonStars size="1.5rem" />}
		</ActionIcon>
	);
};
