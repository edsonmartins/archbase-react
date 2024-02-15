import { useLocalStorage } from '@mantine/hooks';

export function useArchbaseColorScheme() {
	const [colorScheme, setColorScheme] = useLocalStorage<'dark' | 'light'>({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = () => (colorScheme === 'dark' ? setColorScheme('light') : setColorScheme('dark'));
	return { colorScheme, setColorScheme, toggleColorScheme };
}
