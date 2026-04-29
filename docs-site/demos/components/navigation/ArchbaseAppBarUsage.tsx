import React, { useState } from 'react';
import { Stack, Card, Text, Box, Button } from '@mantine/core';
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
          logoSrc="/logo.png"
          onBurgerClick={() => setMenuOpened(!menuOpened)}
          burgerOpened={menuOpened}
          actions={[
            { icon: <IconSearch size={20} />, onClick: () => console.log('search'), tooltip: 'Buscar' },
            { icon: <IconBell size={20} />, onClick: () => console.log('notifications'), badge: 5, tooltip: 'Notificações' },
            { icon: <IconUser size={20} />, onClick: () => console.log('profile'), tooltip: 'Perfil' },
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
          color="blue"
          actions={[
            { icon: <IconSettings size={20} />, onClick: () => console.log('settings'), tooltip: 'Configurações' },
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
          variant="transparent"
          withBorder
          actions={[
            { icon: <IconSearch size={20} />, onClick: () => console.log('search') },
          ]}
        />
        <Box p="md" h={100}>
          <Text size="sm">Variante transparente com borda.</Text>
        </Box>
      </Card>
    </Stack>
  );
}
