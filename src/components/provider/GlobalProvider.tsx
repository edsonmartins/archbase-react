import {
	ColorScheme,
	ColorSchemeProvider,
	EmotionCache,
	MantineProvider,
	MantineThemeOverride,
} from '@mantine/styles';
import React, { useLayoutEffect } from 'react';

interface ArchbaseAppProviderProps {
	children?: React.ReactNode;
	colorScheme: 'dark' | 'light';
}

function GlobalProvider({
	children,
	colorScheme = 'light',
}: ArchbaseAppProviderProps) {
	useLayoutEffect(() => {}, []);
	return (
		<MantineProvider
			theme={{ fontFamily: 'Open Sans' }}
			withGlobalStyles
			withNormalizeCSS
		>
			<ColorSchemeProvider colorScheme={'light'} toggleColorScheme={() => {}}>
				{children}
			</ColorSchemeProvider>
		</MantineProvider>
	);
}

export { GlobalProvider };
