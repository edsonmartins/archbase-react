import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import { InfographicRenderer } from '@archbase/graphics';

export function InfographicRendererUsage() {
  const specification = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Passo 1
      desc: Planejamento
    - label: Passo 2
      desc: Desenvolvimento
    - label: Passo 3
      desc: Testes
    - label: Passo 4
      desc: Deploy
  `;

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Infographic Básico</Title>
      <Text size="sm">Exemplo simples de um infográfico de processo</Text>
      <Container
        style={{
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <InfographicRenderer
          width="100%"
          height="300px"
          specification={specification}
        />
      </Container>
    </Stack>
  );
}
