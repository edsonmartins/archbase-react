import React from 'react';
import { Paper, Text } from '@mantine/core';
import { useArchbaseNavigationListener } from '@components/admin/ArchbaseNavigation.context';

export function PessoaForm() {
  const { closeAllowed } = useArchbaseNavigationListener('/pessoa/nova', () => {
    closeAllowed();
  });

  return (
    <Paper style={{ overflow: 'none', height: '100%', width: '100%' }}>
      <Text>Nova pessoa</Text>
    </Paper>
  );
}
