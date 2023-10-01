import React from 'react';
import { Paper, Text } from '@mantine/core';
import { useArchbaseNavigationListener } from '../../components/admin/ArchbaseNavigation.context';

export function HomeView() {
  const { closeAllowed } = useArchbaseNavigationListener('/home', () => {
    closeAllowed();
  });

  return <Paper style={{ overflow: 'none', height: '100%', width: '100%' }}></Paper>;
}
