import type { MantineDemo } from '@mantinex/demo';
import { OnboardingTourUsage } from './OnboardingTourUsage';
import { OnboardingTourCallbacks } from './OnboardingTourCallbacks';
import { ArchbaseNotificationCenterUsage } from './ArchbaseNotificationCenterUsage';
import { ArchbaseChunkProgressBarUsage } from './ArchbaseChunkProgressBarUsage';
import { ArchbaseSkeletonUsage } from './ArchbaseSkeletonUsage';
import { ArchbaseRippleUsage } from './ArchbaseRippleUsage';

// Uso Básico
const usageCode = `
import { useState } from 'react';
import { ArchbaseOnboardingTour, ArchbaseOnboardingTourStep } from '@archbase/components';
import { Button, Paper } from '@mantine/core';

function Demo() {
  const [started, setStarted] = useState(false);

  const steps: ArchbaseOnboardingTourStep[] = [
    {
      id: 'welcome',
      target: '#welcome-element',
      title: 'Bem-vindo!',
      content: 'Este é o primeiro passo do tour.',
    },
    {
      id: 'feature',
      target: '#feature-element',
      title: 'Funcionalidade',
      content: 'Esta é uma funcionalidade importante.',
    },
  ];

  return (
    <ArchbaseOnboardingTour
      steps={steps}
      autoStart={started}
      onEnd={() => setStarted(false)}
    >
      <Button onClick={() => setStarted(true)}>
        Iniciar Tour
      </Button>
      {/* Seu conteúdo aqui */}
    </ArchbaseOnboardingTour>
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: OnboardingTourUsage,
  code: usageCode,
};

// Callbacks
const callbacksCode = `
import { useState } from 'react';
import { ArchbaseOnboardingTour, ArchbaseOnboardingTourStep } from '@archbase/components';

function Demo() {
  const [currentStep, setCurrentStep] = useState<string>('');

  const steps: ArchbaseOnboardingTourStep[] = [
    { id: 'step1', target: '#el1', title: 'Passo 1', content: '...' },
    { id: 'step2', target: '#el2', title: 'Passo 2', content: '...' },
  ];

  return (
    <ArchbaseOnboardingTour
      steps={steps}
      onStart={() => console.log('Tour iniciado')}
      onChange={(step) => setCurrentStep(step.id)}
      onEnd={() => console.log('Tour finalizado')}
    >
      {/* Conteúdo */}
    </ArchbaseOnboardingTour>
  );
}
`;

export const callbacks: MantineDemo = {
  type: 'code',
  component: OnboardingTourCallbacks,
  code: callbacksCode,
};

// ---------------------------------------------------------------------------
// ArchbaseNotificationCenter
// ---------------------------------------------------------------------------

const notificationCenterUsageCode = `
import { useState } from 'react';
import { ArchbaseNotificationCenter } from '@archbase/components';
import type { ArchbaseNotificationItem } from '@archbase/components';

const sampleNotifications: ArchbaseNotificationItem[] = [
  {
    id: '1',
    title: 'Novo pedido recebido',
    message: 'O pedido #1234 foi criado com sucesso.',
    type: 'info',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Backup concluido',
    message: 'O backup diario foi concluido com sucesso.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Espaco em disco baixo',
    message: 'Menos de 10% de espaco disponivel.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

function Demo() {
  const [notifications, setNotifications] = useState(sampleNotifications);

  return (
    <ArchbaseNotificationCenter
      notifications={notifications}
      onMarkAsRead={(id) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      }
      onMarkAllAsRead={() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      }
      onRemove={(id) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }
      renderAs="popover"
      showBadge
    />
  );
}
`;

export const notificationCenterUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseNotificationCenterUsage,
  code: notificationCenterUsageCode,
};

// ---------------------------------------------------------------------------
// ArchbaseChunkProgressBar
// ---------------------------------------------------------------------------

const chunkProgressBarUsageCode = `
import { useState } from 'react';
import { ArchbaseChunkProgressBar } from '@archbase/components';
import { Stack, Slider, Card, Text } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState(65);

  return (
    <Stack gap="md">
      <ArchbaseChunkProgressBar
        value={value}
        chunkCount={10}
        label="Progresso do Download"
        showPercentage
        completedColor="blue"
      />

      <ArchbaseChunkProgressBar
        value={value}
        chunkCount={5}
        label="Etapas Concluídas"
        showPercentage
        completedColor="green"
        animated
      />

      <Card withBorder p="md">
        <Text size="sm" mb="xs">Ajustar valor: {value}%</Text>
        <Slider value={value} onChange={setValue} min={0} max={100} />
      </Card>
    </Stack>
  );
}
`;

export const chunkProgressBarUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseChunkProgressBarUsage,
  code: chunkProgressBarUsageCode,
};

// ---------------------------------------------------------------------------
// ArchbaseSkeleton (Templates)
// ---------------------------------------------------------------------------

const skeletonUsageCode = `
import { Tabs, Group } from '@mantine/core';
import {
  ArchbaseDataGridSkeleton,
  ArchbaseFormSkeleton,
  ArchbaseCardSkeleton,
  ArchbaseKanbanSkeleton,
  ArchbaseListSkeleton,
} from '@archbase/components';

function Demo() {
  return (
    <Tabs defaultValue="grid">
      <Tabs.List>
        <Tabs.Tab value="grid">DataGrid</Tabs.Tab>
        <Tabs.Tab value="form">Form</Tabs.Tab>
        <Tabs.Tab value="card">Card</Tabs.Tab>
        <Tabs.Tab value="kanban">Kanban</Tabs.Tab>
        <Tabs.Tab value="list">List</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="grid" pt="md">
        <ArchbaseDataGridSkeleton rows={5} columns={4} />
      </Tabs.Panel>

      <Tabs.Panel value="form" pt="md">
        <ArchbaseFormSkeleton fields={6} columns={2} showActions />
      </Tabs.Panel>

      <Tabs.Panel value="card" pt="md">
        <Group>
          <ArchbaseCardSkeleton showImage showActions />
          <ArchbaseCardSkeleton showAvatar lines={4} />
        </Group>
      </Tabs.Panel>

      <Tabs.Panel value="kanban" pt="md">
        <ArchbaseKanbanSkeleton columns={3} cardsPerColumn={2} />
      </Tabs.Panel>

      <Tabs.Panel value="list" pt="md">
        <ArchbaseListSkeleton items={5} showAvatar showDescription />
      </Tabs.Panel>
    </Tabs>
  );
}
`;

export const skeletonUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseSkeletonUsage,
  code: skeletonUsageCode,
};

// ---------------------------------------------------------------------------
// ArchbaseRipple
// ---------------------------------------------------------------------------

const rippleUsageCode = `
import { ArchbaseRipple } from '@archbase/components';
import { Card, Text, Button, Group } from '@mantine/core';

function Demo() {
  return (
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

      <ArchbaseRipple color="red">
        <Button variant="filled" color="red" size="lg">
          Botão com Ripple
        </Button>
      </ArchbaseRipple>
    </Group>
  );
}
`;

export const rippleUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseRippleUsage,
  code: rippleUsageCode,
};
