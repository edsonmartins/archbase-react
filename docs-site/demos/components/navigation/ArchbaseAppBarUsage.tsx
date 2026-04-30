import React, { useState } from 'react';
import { Stack, Card, Text, Box, Button, Image } from '@mantine/core';
import { IconBell, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import { ArchbaseAppBar } from '@archbase/components';

export function ArchbaseAppBarUsage() {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">
        AppBar responsivo com suporte a menu burger para dispositivos móveis.
      </Text>

      <Card withBorder p={0} style={{ overflow: 'hidden' }}>
        <ArchbaseAppBar
          title="Meu Aplicativo"
          leftSection={<Image src="/logo.png" w={32} h={32} alt="Logo" />}
          onBurgerClick={() => setMenuOpened(!menuOpened)}
          burgerOpened={menuOpened}
          actions={[
            { key: 'search', label: 'Buscar', icon: <IconSearch size={20} />, onClick: () => console.log('search') },
            { key: 'notifications', label: 'Notificações', icon: <IconBell size={20} />, onClick: () => console.log('notifications') },
            { key: 'profile', label: 'Perfil', icon: <IconUser size={20} />, onClick: () => console.log('profile') },
          ]}
        />
        <Box p="md" h={100}>
          <Text size="sm">Conteúdo da página...</Text>
        </Box>
      </Card>

      <Card withBorder p={0} style={{ overflow: 'hidden' }}>
        <ArchbaseAppBar
          title="Dashboard"
          subtitle="Visão geral do sistema"
          backgroundColor="var(--mantine-color-blue-6)"
          textColor="white"
          actions={[
            { key: 'settings', label: 'Configurações', icon: <IconSettings size={20} />, onClick: () => console.log('settings') },
          ]}
          rightSection={
            <Button variant="white" size="xs">
              Novo
            </Button>
          }
        />
        <Box p="md" h={100}>
          <Text size="sm">AppBar com cor customizada e seção direita.</Text>
        </Box>
      </Card>

      <Card withBorder p={0} style={{ overflow: 'hidden' }}>
        <ArchbaseAppBar
          title="App Transparente"
          withBorder
          actions={[
            { key: 'search', label: 'Buscar', icon: <IconSearch size={20} />, onClick: () => console.log('search') },
          ]}
        />
        <Box p="md" h={100}>
          <Text size="sm">AppBar com borda.</Text>
        </Box>
      </Card>
    </Stack>
  );
}
