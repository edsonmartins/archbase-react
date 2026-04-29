import React, { useState } from 'react';
import { Stack, Card, Text, Box } from '@mantine/core';
import { IconHome, IconSearch, IconBell, IconUser, IconSettings } from '@tabler/icons-react';
import { ArchbaseBottomNavigation } from '@archbase/components';

export function ArchbaseBottomNavigationUsage() {
  const [active, setActive] = useState('home');

  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">
        BottomNavigation é fixo na parte inferior da tela em dispositivos móveis.
      </Text>

      <Card withBorder p="xl" h={300} pos="relative" style={{ overflow: 'hidden' }}>
        <Text size="sm" mb="md">
          Página ativa: <strong>{active}</strong>
        </Text>

        <Box pos="absolute" bottom={0} left={0} right={0}>
          <ArchbaseBottomNavigation
            value={active}
            onChange={setActive}
            items={[
              { value: 'home', label: 'Início', icon: <IconHome size={20} /> },
              { value: 'search', label: 'Buscar', icon: <IconSearch size={20} /> },
              { value: 'notifications', label: 'Avisos', icon: <IconBell size={20} />, badge: 3 },
              { value: 'profile', label: 'Perfil', icon: <IconUser size={20} /> },
            ]}
          />
        </Box>
      </Card>

      <Card withBorder p="xl" h={300} pos="relative" style={{ overflow: 'hidden' }}>
        <Text size="sm" mb="md">Com 5 itens e sem labels:</Text>

        <Box pos="absolute" bottom={0} left={0} right={0}>
          <ArchbaseBottomNavigation
            value={active}
            onChange={setActive}
            showLabels={false}
            items={[
              { value: 'home', label: 'Início', icon: <IconHome size={24} /> },
              { value: 'search', label: 'Buscar', icon: <IconSearch size={24} /> },
              { value: 'notifications', label: 'Avisos', icon: <IconBell size={24} /> },
              { value: 'settings', label: 'Config', icon: <IconSettings size={24} /> },
              { value: 'profile', label: 'Perfil', icon: <IconUser size={24} /> },
            ]}
          />
        </Box>
      </Card>
    </Stack>
  );
}
