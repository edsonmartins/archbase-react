import React, { useState } from 'react';
import { ArchbaseOnboardingTour, ArchbaseOnboardingTourStep } from '@archbase/components';
import { Button, Container, Paper, Text, Stack, Title } from '@mantine/core';

export function OnboardingTourUsage() {
  const [started, setStarted] = useState(false);

  const steps: ArchbaseOnboardingTourStep[] = [
    {
      id: 'welcome',
      target: '#tour-welcome',
      title: 'Bem-vindo ao Tour!',
      content: 'Este é um exemplo de tour interativo usando o ArchbaseOnboardingTour.',
    },
    {
      id: 'feature-1',
      target: '#tour-feature-1',
      title: 'Primeira Funcionalidade',
      content: 'Esta é a primeira funcionalidade que queremos destacar.',
    },
    {
      id: 'feature-2',
      target: '#tour-feature-2',
      title: 'Segunda Funcionalidade',
      content: 'Esta é a segunda funcionalidade importante do sistema.',
    },
  ];

  return (
    <ArchbaseOnboardingTour
      steps={steps}
      autoStart={started}
      onEnd={() => setStarted(false)}
    >
      <Container size="md" py="xl">
        <Stack gap="xl">
          <Paper id="tour-welcome" p="xl" withBorder>
            <Title order={2}>Bem-vindo</Title>
            <Text mt="sm">
              Clique no botão abaixo para iniciar o tour interativo.
            </Text>
            <Button mt="md" onClick={() => setStarted(true)}>
              Iniciar Tour
            </Button>
          </Paper>

          <Paper id="tour-feature-1" p="xl" withBorder>
            <Title order={3}>Primeira Funcionalidade</Title>
            <Text mt="sm">
              Esta é uma demonstração da primeira funcionalidade que será destacada durante o tour.
            </Text>
          </Paper>

          <Paper id="tour-feature-2" p="xl" withBorder>
            <Title order={3}>Segunda Funcionalidade</Title>
            <Text mt="sm">
              Esta é a segunda funcionalidade importante do sistema.
            </Text>
          </Paper>
        </Stack>
      </Container>
    </ArchbaseOnboardingTour>
  );
}
