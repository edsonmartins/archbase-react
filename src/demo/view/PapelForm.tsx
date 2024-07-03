import React from 'react';
import { Paper, Text } from '@mantine/core';
import { useArchbaseNavigationListener } from '../../components/admin/ArchbaseNavigation.context';

export function PapelForm() {
  const { closeAllowed } = useArchbaseNavigationListener('/pessoapapel/novo', () => {
    closeAllowed();
  });

  return (
    <Paper style={{ overflow: 'none', height: '100%', width: '100%' }}>
      <Text>Novo papel de pessoa</Text>
    </Paper>
  );
}
