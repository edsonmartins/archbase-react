import type { MantineDemo } from '@mantinex/demo';
import { OnboardingTourUsage } from './OnboardingTourUsage';
import { OnboardingTourCallbacks } from './OnboardingTourCallbacks';
import { ArchbaseNotificationCenterUsage } from './ArchbaseNotificationCenterUsage';

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
