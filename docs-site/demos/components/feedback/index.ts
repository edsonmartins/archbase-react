import type { MantineDemo } from '@mantinex/demo';
import { OnboardingTourUsage } from './OnboardingTourUsage';
import { OnboardingTourCallbacks } from './OnboardingTourCallbacks';

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
