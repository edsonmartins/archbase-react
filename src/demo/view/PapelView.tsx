import { Paper, Text } from '@mantine/core';
import React from 'react';
import { useArchbaseNavigationListener } from '../../components/admin/ArchbaseNavigation.context';

export function PapelView() {
	const { closeAllowed } = useArchbaseNavigationListener('/pessoapapel/consulta', () => {
		closeAllowed();
	});

	return (
		<Paper style={{ overflow: 'none', height: '100%', width: '100%' }}>
			<Text>Consulta papéis da pessoas</Text>
		</Paper>
	);
}
