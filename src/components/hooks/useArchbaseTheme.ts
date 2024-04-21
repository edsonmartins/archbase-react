import { useMantineColorScheme, useMantineTheme } from '@mantine/core';

export function useArchbaseTheme() {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	return {...theme, colorScheme};
}
