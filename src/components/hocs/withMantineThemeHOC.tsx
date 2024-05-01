import { useMantineTheme } from '@mantine/core';
import React from 'react';

export const withArchbaseMantineThemeHOC = (Component: any) => {
	return (props: any) => {
		const theme = useMantineTheme();

		return <Component theme={theme} {...props} />;
	};
};
