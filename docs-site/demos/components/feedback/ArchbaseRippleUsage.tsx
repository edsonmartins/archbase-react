import React from 'react';
import { Stack, Group, Card, Text, Button } from '@mantine/core';
import { ArchbaseRipple } from '@archbase/components';

export function ArchbaseRippleUsage() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">Clique nos elementos abaixo para ver o efeito ripple:</Text>

      <Group>
        <ArchbaseRipple color="blue">
          <Card withBorder p="xl" style={{ cursor: 'pointer' }}>
            <Text>Clique aqui (azul)</Text>
          </Card>
        </ArchbaseRipple>

        <ArchbaseRipple color="green" centered>
          <Card withBorder p="xl" style={{ cursor: 'pointer' }}>
            <Text>Ripple centralizado (verde)</Text>
          </Card>
        </ArchbaseRipple>

        <ArchbaseRipple color="violet" duration={800}>
          <Card withBorder p="xl" style={{ cursor: 'pointer' }}>
            <Text>Duração maior (violeta)</Text>
          </Card>
        </ArchbaseRipple>
      </Group>

      <ArchbaseRipple color="red">
        <Button variant="filled" color="red" size="lg">
          Botão com Ripple
        </Button>
      </ArchbaseRipple>
    </Stack>
  );
}
