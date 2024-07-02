import { MantineTheme } from '@mantine/core';
import type { MenuItemStyles } from 'react-pro-sidebar';
import { menuClasses } from 'react-pro-sidebar';
import { createThemedStyles } from './createThemedStyles';

export const buildMenuItemStyles = (
	colorScheme,
	theme: MantineTheme,
	collapsed: boolean,
	menuIconWidth: number,
	sidebarCollapsedWidth: number,
	hasMultipleGroups: boolean,
	iconsWithBackground: boolean,
	menuItemHeight: string | number,
): MenuItemStyles => {
	const themes = createThemedStyles(theme);
	const buttonPadding = hasMultipleGroups
		? {}
		: { padding: collapsed ? `0 ${(sidebarCollapsedWidth - menuIconWidth) / 2}px` : '0 20px' };
	const subMenuIconDisplay = hasMultipleGroups ? {} : { display: 'none' };
	const iconsBackgroundColor = iconsWithBackground ? (colorScheme === 'dark' ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][0]) : undefined;
	return {
		root: {
			fontSize: '14px',
			fontWeight: 400,
			background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
			color: theme.white,
		},
		icon: {
			background: iconsBackgroundColor,
			color: colorScheme === 'dark' ? theme.colors[theme.primaryColor][0] : theme.colors[theme.primaryColor][7],
			[`&.${menuClasses.disabled}`]: {
				color: themes[colorScheme].menu.disabled.color,
			},
		},
		SubMenuExpandIcon: {
			color: '#b6b7b9',
			...subMenuIconDisplay,
		},
		subMenuContent: () => ({
			backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors[theme.primaryColor][0],
		}),
		button: {
			[`&.${menuClasses.disabled}`]: {
				color: themes[colorScheme].menu.disabled.color,
			},
			'&:hover': {
				backgroundColor:
					colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6],
				color: theme.white,
			},
			[`&.${menuClasses.active}`]: {
				backgroundColor: colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6],
			},
			height: menuItemHeight,
			...buttonPadding,
		},

		label: ({ open }) => ({
			fontWeight: open ? 600 : undefined,
			color: colorScheme === 'dark' ? theme.white : theme.black,
			'&:hover': {
				color: theme.white,
			},
		}),
	};
};
