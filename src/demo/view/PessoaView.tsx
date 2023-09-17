import React from 'react';
import { Paper, Text } from '@mantine/core';
import { useArchbaseNavigationListener } from '@components/admin/ArchbaseNavigation.context';

export function PessoaView() {
  const { closeAllowed } = useArchbaseNavigationListener('/pessoa/consulta', () => {
    closeAllowed();
  });

  return (
    <Paper style={{ overflow: 'none', height: '100%', width: '100%' }}>
      <Text>Consulta pessoas</Text>
    </Paper>
  );
}
