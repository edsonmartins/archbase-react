import React, { useState } from 'react';
import { ArchbaseOnboardingTour, ArchbaseOnboardingTourStep } from '@archbase/components';
import { Button, Container, Paper, Text, Stack, Badge, Alert } from '@mantine/core';

export function OnboardingTourCallbacks() {
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [tourStatus, setTourStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  const steps: ArchbaseOnboardingTourStep[] = [
    {
      id: 'step-1',
      target: '#callback-step-1',
      title: 'Passo 1',
      content: 'Este passo demonstra o callback onChange.',
    },
    {
      id: 'step-2',
      target: '#callback-step-2',
      title: 'Passo 2',
      content: 'Você pode acompanhar o progresso pelo badge acima.',
    },
    {
      id: 'step-3',
      target: '#callback-step-3',
      title: 'Passo 3',
      content: 'Ao finalizar, o callback onEnd será chamado.',
    },
  ];

  return (
    <ArchbaseOnboardingTour
      steps={steps}
      onStart={() => setTourStatus('running')}
      onChange={(step) => setCurrentStepId(step.id)}
      onEnd={() => {
        setTourStatus('completed');
        setCurrentStepId('');
      }}
    >
      <Container size="md" py="xl">
        <Stack gap="xl">
          <Alert>
            <Text>
              Status do tour: <Badge>{tourStatus}</Badge>
              {currentStepId && <Badge ml="xs">Passo atual: {currentStepId}</Badge>}
            </Text>
          </Alert>

          <Paper id="callback-step-1" p="xl" withBorder>
            <Text fw={500}>Passo 1 - Callback onChange</Text>
            <Text mt="sm" size="sm" c="dimmed">
              O callback onChange é chamado a cada passo do tour.
            </Text>
          </Paper>

          <Paper id="callback-step-2" p="xl" withBorder>
            <Text fw={500}>Passo 2 - Acompanhamento</Text>
            <Text mt="sm" size="sm" c="dimmed">
              O badge acima mostra o passo atual em tempo real.
            </Text>
          </Paper>

          <Paper id="callback-step-3" p="xl" withBorder>
            <Text fw={500}>Passo 3 - Finalização</Text>
            <Text mt="sm" size="sm" c="dimmed">
              Ao completar, o callback onEnd é chamado.
            </Text>
          </Paper>

          <Button onClick={() => setTourStatus('running')}>
            Reiniciar Tour
          </Button>
        </Stack>
      </Container>
    </ArchbaseOnboardingTour>
  );
}
