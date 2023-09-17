import React from 'react';
import { Paper, Text } from '@mantine/core';
import { useArchbaseNavigationListener } from '@components/admin/ArchbaseNavigation.context';

export function PedidoView() {
  const { closeAllowed } = useArchbaseNavigationListener('/pedido/consulta', () => {
    closeAllowed();
  });

  return (
    <Paper style={{ overflow: 'none', height: '100%', width: '100%' }}>
      <Text>Consulta pedidos</Text>
    </Paper>
  );
}
