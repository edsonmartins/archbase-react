import { Paper, Text } from '@mantine/core';
import React from 'react';
import { useArchbaseNavigationListener } from '../../components/admin/ArchbaseNavigation.context';

export function PedidoForm() {
	const { closeAllowed } = useArchbaseNavigationListener('/pedido/novo', () => {
		closeAllowed();
	});

	return (
		<Paper style={{ overflow: 'none', height: '100%', width: '100%' }}>
			<Text>Novo pedido</Text>
		</Paper>
	);
}
